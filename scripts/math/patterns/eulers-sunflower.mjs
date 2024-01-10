/**
 * Generates a spiral pattern using a function based on a variation of Euler's formula.
 * Z(theta) = e^(theta x i) + e^(pi x theta x i)
 * It starts at the origin and spirals outwards. The second parameter must be a math object with the following functions:
 * add(...terms) - returns the sum of the terms where each term is a complex number
 * multiply(...terms) - returns the product of the terms where each term is a complex number
 * exp(a) - returns e^a where a is a complex number
 * pi - returns the value of pi
 * i - returns the imaginary unit
 * Note that the math object need to support these two complex numbers operations:
 * -  math.multiply(theta, math.i)
 * -  math.multiply(math.pi, theta, math.i)
 * @param {*} canvas The canvas element to render to
 * @param {*} math The math object to use for complex number operations, such as math.add, math.multiply, math.exp, math.pi, and math.i
 */
function renderEulersSunflower(canvas, math, num = Math.PI) {
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var centerX = width / 2;
  var centerY = height / 2;
  var scale = 0.45;
  var theta = 0;
  var theta_increment = 0.01;

  ctx.translate(centerX, centerY);

  var initialX, initialY;

  var shouldContinueDrawing = true;
  var debuggingEnabled = false;
  const toggleDebugging = () => {
    debuggingEnabled = !debuggingEnabled;
  };

  function draw() {
    var z = math.add(
      math.exp(math.multiply(theta, math.i)),
      math.exp(math.multiply(num, theta, math.i))
    );

    var x = ((z.re * width) / 2) * scale;
    var y = ((z.im * height) / 2) * scale;

    // // Log the x and y values and the angle
    // console.log("Point:", x, y, "Angle:", theta);

    // Calculate the distance of the current point from the center of the canvas
    var distanceFromCenter = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    // Change the stroke color based on the distance from the center
    if (distanceFromCenter < 1) {
      ctx.strokeStyle = "red"; // Red for points close to the center
    } else if (distanceFromCenter < 2) {
      ctx.strokeStyle = "green"; // Green for points a little further out
    } else {
      ctx.strokeStyle = "blue"; // Blue for points even further out
    }

    // If this is the first call to draw, store the initial x and y values
    if (initialX === undefined && initialY === undefined) {
      initialX = x;
      initialY = y;
    }

    // If the current x and y values are close to the initial values, set shouldContinueDrawing to false
    var tolerance = 0.01;
    const xDiff = Math.abs(x - initialX);

    if (xDiff < tolerance && theta > 1) {
      shouldContinueDrawing = false;
    }

    ctx.lineTo(x, y);
    ctx.stroke();

    theta += theta_increment;

    if (debuggingEnabled) {
      console.log("drawing", {
        xDiff,
        theta,
      });
    }

    // If shouldContinueDrawing is true, call requestAnimationFrame
    if (shouldContinueDrawing) {
      requestAnimationFrame(draw);
    }
  }

  var controller = {
    start: function () {
      shouldContinueDrawing = true;
      draw();
    },
    stop: function () {
      shouldContinueDrawing = false;
    },
    resume: function () {
      shouldContinueDrawing = true;
      draw();
    },
    restart: function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      theta = 0;
      initialX = undefined;
      initialY = undefined;
      shouldContinueDrawing = true;
      draw();
    },
    print: function (valueName) {
      if (valueName === "angle") {
        console.log(theta);
      }
    },
    toggleDebugging: toggleDebugging,
  };

  return controller;
}

export default renderEulersSunflower;
