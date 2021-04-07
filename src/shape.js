class Shape {
    constructor(sideLength, nSides) {
        this.sideLength = sideLength;
        this.nSides = nSides;
        this.x = 0;
        this.y = 0;
        this.startingAngle = 0;
    }

    /**
     * Get center of shape. With arguments, also sets the centre to [x, y]
     * @param {number} x - x coordinate to set to 
     * @param {number} y - y coordinate to set to
     * @returns {[number, number]} 
     */
    centre(x = undefined, y = undefined) {
        if (typeof x === 'number' && typeof y === 'number') {
            this.x = x;
            this.y = y;
        }
        return [this.x, this.y];
    }

    /** Get angle of inside segments */
    getTheta() {
        return TWO_PI / this.nSides;
    }

    /** Get shape "radius" - distance from centre to farthest point */
    getRadius() {
        const θ = this.getTheta(), α = (Math.PI - θ) / 2;
        let r = (this.sideLength / Math.sin(θ)) * Math.sin(α);
        return r;
    }
    
    /**
     * Set shape radius (instead of side length)
     * @param {number} r - Radius
     * @returns {number} Side length
     */
    setRadius(r) {
        const θ = this.getTheta(), α = (Math.PI - θ) / 2;
        let l = (r / Math.sin(α)) * Math.sin(θ);
        this.sideLength = l;
        return l;
    }

    /**
     * Get points of turning
     * @return {number[]}
     */
    getPoints() {
        const points = [], θ = this.getTheta(), radius = this.getRadius();
        let α = this.startingAngle;
        for (let n = 0; n <= this.nSides; n++) {
            let coords = rotateCoordinates(radius, α, this.x, this.y);
            points.push(coords);
            α += θ;
        }
        return points;
    }

    /** Draw border of shape */
    drawOutline() {
        let points = this.getPoints();

        for (let i = 0; i < points.length - 1; i++) {
            line(...points[i], ...points[i + 1]);
        }
    }
    
    /** Get height of each triangle segment */
    getSegmentHeight() {
        return Math.sqrt(Math.pow(this.getRadius(), 2) - Math.pow(this.sideLength / 2, 2));
    }

    /** Draw each triangle segment */
    drawTriangleSegments(label = false) {
        let points = this.getPoints();
        for (let i = 0; i < points.length - 1; i++) {
            line(this.x, this.y, ...points[i]);
            line(...points[i], ...points[i + 1]);
            line(this.x, this.y, ...points[i + 1]);
            if (label) {
                text(i.toString(), points[i][0], points[i][1]);
            }
        }
    }

    /** Draw line (height) in each segment */
    drawSegmentHeights() {
        let points = this.getPoints();
        let h = this.getSegmentHeight(), θ = this.getTheta(), hθ = θ / 2;
        for (let i = 0, a = this.startingAngle; i < points.length - 1; i++, a += θ) {
            line(this.x, this.y, ...rotateCoordinates(h, a + hθ, this.x, this.y));
        }
    }

    /**
     * Get [x, y] coordinates of point on radius at certain angle
     * @param {number} angle - Angle of point from centre (radians)
     * @returns {[number, number]} Coordinates
    */
    pointOnRadius(angle) {
        const θ = this.getTheta();
        const sector = Math.floor(angle / θ);

        let angleInSector = angle - (sector * θ);
        let angleFromHeight = (θ / 2) - angleInSector;
        let armLength = this.getSegmentHeight() / Math.cos(Math.abs(angleFromHeight));

        return rotateCoordinates(armLength, this.startingAngle + angle, this.x, this.y);
    }

    /**
     * Return angle that coordinates are from shape centre
     * @param {number} x
     * @param {number} y
     * @returns {number} angle in radians
     */
    getAngleFromCentre(x, y) {
        let offset = Math.atan((this.x - x) / (this.y - y));
        switch (this.getDirIn(x, y)) {
            case DIRECTIONS.TOP_LEFT:
            case DIRECTIONS.TOP_RIGHT:
                return THREE_HALF_PI - offset;
            case DIRECTIONS.BOTTOM_LEFT:
            case DIRECTIONS.BOTTOM_RIGHT:
                return HALF_PI - offset;
            case DIRECTIONS.UP:
                return THREE_HALF_PI;
            case DIRECTIONS.DOWN:
                return HALF_PI;
            case DIRECTIONS.LEFT:
                return Math.PI;
            case DIRECTIONS.RIGHT:
                return 0;
            default:
                return NaN;
        }
    }

    /**
     * Get diraction coordinates are in
     * @param {number} x
     * @param {number} y
     * @returns {DIRECTIONS} Return a dorection (member of DIRECTIONS enum)
    */
    getDirIn(x, y) {
        if (x < this.x && y < this.y) return DIRECTIONS.TOP_LEFT;
        if (x > this.x && y < this.y) return DIRECTIONS.TOP_RIGHT;
        if (x < this.x && y > this.y) return DIRECTIONS.BOTTOM_LEFT;
        if (x > this.x && y > this.y) return DIRECTIONS.BOTTOM_RIGHT;

        if (x == this.x && y < this.y) return DIRECTIONS.UP;
        if (x == this.x && y > this.y) return DIRECTIONS.DOWN;
        if (x < this.x && y == this.y) return DIRECTIONS.LEFT;
        if (x > this.x && y == this.y) return DIRECTIONS.RIGHT;
    }
}