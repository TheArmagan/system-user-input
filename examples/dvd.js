const { InputSimulator } = require("../dist/index.js");

const simulator = new InputSimulator();
simulator.start();

const screenWidth = 1920;
const screenHeight = 1080;
const intervalMs = 100;
const moveDurationMs = 100; // Duration for the mouse move animation
const speed = 100; // Pixels per interval
const killDuration = 15000; // Duration to kill the process

let currentX = Math.random() * screenWidth;
let currentY = Math.random() * screenHeight;
let currentAngle = Math.random() * 2 * Math.PI; // Random initial angle in radians

const movementInterval = setInterval(() => {
  // Calculate the change in position for this interval
  const deltaX = speed * Math.cos(currentAngle);
  const deltaY = speed * Math.sin(currentAngle);

  // Calculate the next potential position
  let nextX = currentX + deltaX;
  let nextY = currentY + deltaY;

  // Check for collision with vertical walls
  if (nextX < 0 || nextX > screenWidth) {
    currentAngle = Math.PI - currentAngle; // Reflect horizontally
    nextX = Math.max(0, Math.min(nextX, screenWidth)); // Clamp to bounds
  }

  // Check for collision with horizontal walls
  if (nextY < 0 || nextY > screenHeight) {
    currentAngle = -currentAngle; // Reflect vertically
    nextY = Math.max(0, Math.min(nextY, screenHeight)); // Clamp to bounds
  }

  // Update current position
  currentX = nextX;
  currentY = nextY;

  // Move the mouse
  simulator.mouse.move(~~currentX, ~~currentY, moveDurationMs, "linear");

}, intervalMs);

// Stop after 5 seconds
setTimeout(() => {
  clearInterval(movementInterval);
  simulator.stop(); // Optional: stop the simulator process
  process.exit(0);
}, killDuration);