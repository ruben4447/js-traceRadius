# Trace Radius
Simple module that find point on any regular polygon's radius given an angle of rotation

The main file is `src/shape.js`, the rest is just for demo purposes

## Shape
To create an N-sided polygon, the code is `new Shape(sideLength, nSides);` where:
- `sideLength` is the length of each side. This is used to calculate the shape radius (use `<Shape>.setRadius(r)` to set the radius, which will then be used to calculate `<Shape>.sideLength`)
- `nSides` is the number of sides that the polygon has. Do not go below 3.

## Method
THe main method in this file is `<Shape>.pointOnRadius(angle)` which, given an angle of rotation (radians) returns the coordinates of a point on the radius.

## Demo App
The demo has four modes. Each mode utilises the pointOnRadius method but in different ways:
- *Rotate* - A point rotates around the shapes perimeter
- *Follow Mouse* - The angle between your mouse and the shape centre is calculated, and a point is drawn on the shape's radius at this angle.
- *Graph* - A point orbits the shape's radius, and a graph is drawn corresponding to the points Y position relative to the shape's centre.
- *Colours* - N points (equivalent to the number of sides) orbit the shape and use HSB to create a nice visual