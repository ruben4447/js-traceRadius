const c_radToDeg = 180 / Math.PI;
const c_degToRad = Math.PI / 180;

const radToDeg = rad => rad * c_radToDeg;
const degToRad = deg => deg * c_degToRad;

const rotateCoordinates = (r, theta, cx = 0, cy = 0) => ([cx + r * Math.cos(theta), cy + r * Math.sin(theta)]);
const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

const TWO_PI = 2 * Math.PI;
const HALF_PI = 0.5 * Math.PI;
const THREE_HALF_PI = 1.5 * Math.PI;

const DIRECTIONS = Object.freeze({
    TOP_LEFT: 'tl',
    TOP_RIGHT: 'tr',
    BOTTOM_LEFT: 'bl',
    BOTTOM_RIGHT: 'br',
    UP: 'u',
    DOWN: 'd',
    LEFT: 'l',
    RIGHT: 'r',
});