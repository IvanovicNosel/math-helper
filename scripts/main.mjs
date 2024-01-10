import math from "./math/index.mjs";
import renderEulersSunflower from "./math/patterns/eulers-sunflower.mjs";

function renderFlower() {
  const $ = document.querySelector.bind(document);
  const canvas = $("#canvas");

  // Resize the canvas to take as much horizontal space as possible
  var container = canvas.parentElement;
  var style = window.getComputedStyle(container);
  var padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  canvas.width = container.clientWidth - padding;
  canvas.height = canvas.width; // Maintain the aspect ratio

  const { toggleDebugging, ...animationControls } = renderEulersSunflower(
    canvas,
    math
  );

  window.Flower = window.Flower || {};
  window.Flower.toggleDebugging = toggleDebugging;

  const { start, stop, resume, restart, print } = animationControls;

  window.Flower.start = start;
  window.Flower.stop = stop;
  window.Flower.resume = resume;
  window.Flower.restart = restart;
  window.Flower.print = print;

  const startButton = $("#controls .start");
  const stopButton = $("#controls .stop");

  startButton.onclick = start;
  stopButton.onclick = stop;
}

(function () {
  document.addEventListener("DOMContentLoaded", renderFlower);
})();
