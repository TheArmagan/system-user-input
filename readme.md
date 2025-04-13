# ✨ System User Input ✨

A **robust** Node.js library for capturing and simulating system-wide user input events like a pro! 🚀

## 💡 Introduction

Ever needed to listen to keyboard and mouse events *globally* across the entire system? Look no further! This library provides a powerful and flexible way to capture user interactions seamlessly. It's built to handle various scenarios with specialized listeners:

*   **⌨️ Direct Key Listener:** Captures individual key presses and releases with precision.
*   **🧠 Complex Key Listener:** Deciphers intricate key combinations effortlessly.
*   **⏱️ Hold and Release Listener:** Tracks key sequences, including hold durations and release timings (Details coming soon!).
*   **🖱️ Mouse Listener:** Monitors mouse movements and button clicks accurately.
*   **🤖 Input Simulator:** Programmatically simulate keyboard and mouse actions for automation or testing.

**Built for Compatibility:** Works smoothly across Windows, Linux, and MacOS! 💻

## 🚀 Installation

```bash
pnpm install system-user-input
```

## 🛠️ Usage Example

Get started quickly with this simple example using the `ComplexKeyListener`:

```typescript
import { ComplexKeyListener } from "system-user-input";

// Initialize the listener
const listener = new ComplexKeyListener();

// Listen for direct key events
listener.on("direct", (event) => {
  console.log("Direct Event:", event);
});

// Listen for key combination events
listener.on("press", (event) => {
  console.log("Press Event:", event);
});

// Start listening!
listener.start().then(() => {
  console.log("Listener started successfully! Listening for 10 seconds...");
});

// Example: Stop the listener after 10 seconds
setTimeout(() => {
  listener.stop().then(() => {
    console.log("Listener stopped.");
  });
}, 10000);
```

## 📚 API Reference & Examples

### `KeyListener` (Base Class)

The foundation for all listeners. You'll typically use one of the specialized subclasses below.

*   **`constructor(type: KeyListenerType)`**: Creates a new listener instance.
*   **`start(): Promise<boolean>`**: Initiates the event listening process. Returns `true` if successful.
*   **`stop(): Promise<boolean>`**: Halts the event listening process. Returns `true` if successful.
*   **`on(event: string, listener: (data: any) => void): this`**: Subscribes to specific event types (`direct`, `press`, `combination`, `move`, `button`, etc.).

### `DirectKeyListener` ⌨️

Precisely captures individual key presses and releases.

```typescript
import { DirectKeyListener } from "system-user-input";

const listener = new DirectKeyListener();

listener.on("direct", (event) => {
  console.log(`Key '${event.key}' was ${event.pressed ? 'pressed ✅' : 'released ❌'}`);
});

listener.start();
```

*   **`isPressed(...keys: string[]): boolean`**: Checks if *all* specified keys are currently held down.
    ```typescript
    if (listener.isPressed("Control", "C")) {
      console.log("Copy command detected!");
    }
    ```
*   **`keyPressedSince(key: string): number`**: Gets the timestamp (ms since epoch) when the key was last pressed. Returns `0` if not currently pressed.
    ```typescript
    const pressTime = listener.keyPressedSince("Shift");
    if (pressTime > 0) {
      console.log(`Shift key pressed at: ${new Date(pressTime).toLocaleTimeString()}`);
    }
    ```

### `ComplexKeyListener` 🧠

Detects complex key combinations alongside individual presses.

```typescript
import { ComplexKeyListener } from "system-user-input";

const listener = new ComplexKeyListener();

// Individual key presses
listener.on("press", (event) => {
  console.log(`Key Press: ${event.keys[0]}`);
});

// Key combinations
listener.on("combination", (event) => {
  console.log(`Combination Detected: ${event.keys.join(" + ")}`);
});

listener.start();
```

### `MouseListener` 🖱️

Tracks mouse movements and button states globally.

```typescript
import { MouseListener } from "system-user-input";

const listener = new MouseListener();

listener.on("move", (event) => {
  console.log(`Mouse moved to: (${event.x}, ${event.y})`);
});

listener.on("button", (event) => {
  console.log(`Mouse Button '${event.button}' was ${event.pressed ? 'pressed ✅' : 'released ❌'}`);
});

listener.start();
```

*   **`isPressed(...buttons: string[]): boolean`**: Checks if *all* specified mouse buttons are currently held down.
    ```typescript
    if (listener.isPressed("left")) {
      console.log("Left mouse button is pressed.");
    }
    ```
*   **`keyPressedSince(button: string): number`**: Gets the timestamp (ms since epoch) when the button was last pressed. Returns `0` if not currently pressed.
    ```typescript
    const pressTime = listener.keyPressedSince("right");
    // ... check pressTime ...
    ```
*   **`position: { x: number; y: number; lastMoveAt: number }`**: Access the current mouse coordinates (`x`, `y`) and the timestamp (`lastMoveAt`) of the last movement event.
    ```typescript
    const { x, y, lastMoveAt } = listener.position;
    console.log(`Current Position: (${x, y}), Last Moved: ${new Date(lastMoveAt).toLocaleTimeString()}`);
    ```

### `InputSimulator` 🤖

Provides functionality to simulate keyboard and mouse input events programmatically. Useful for automation, testing, or creating macros.

```typescript
import { InputSimulator } from "system-user-input";
import { setTimeout } from "timers/promises"; // Use promise-based setTimeout for async/await

async function runSimulation() {
  const simulator = new InputSimulator();
  await simulator.start();

  console.log("Simulator started. Simulating input...");

  // Simulate mouse movement
  await simulator.mouse.move(100, 100, 500, "easeInOutQuad"); // Move to (100, 100) over 500ms
  console.log("Moved mouse");

  // Simulate left mouse click
  simulator.mouse.click("left");
  console.log("Clicked left mouse button");
  await setTimeout(100); // Small delay

  // Simulate typing text
  simulator.keyboard.type("Hello, World!");
  console.log("Typed text");
  await setTimeout(100);

  // Simulate pressing and holding Shift, tapping 'A', then releasing Shift
  simulator.keyboard.press("Shift");
  await setTimeout(50); // Hold duration
  simulator.keyboard.tap("A");
  await setTimeout(50);
  simulator.keyboard.release("Shift");
  console.log("Simulated Shift + A");

  await simulator.stop();
  console.log("Simulator stopped.");
}

runSimulation();
```

*   **`start(): Promise<void>`**: Starts the underlying simulation process.
*   **`stop(): Promise<void>`**: Stops the simulation process.
*   **`mouse: MouseSimulator`**: Accessor for mouse simulation methods.
    *   **`click(button?: MouseButton)`**: Simulates a full mouse click (press and release). Defaults to `left`.
    *   **`press(button?: MouseButton)`**: Simulates pressing down a mouse button. Defaults to `left`.
    *   **`release(button?: MouseButton)`**: Simulates releasing a mouse button. Defaults to `left`.
    *   **`move(x: number, y: number, duration?: number, ease?: MouseMoveEase): Promise<void>`**: Moves the mouse cursor to the specified coordinates (`x`, `y`).
        *   `duration` (optional, default `100`ms): Time taken for the movement.
        *   `ease` (optional, default `"linear"`): Easing function for the movement animation.
        *   Returns a promise that resolves when the movement duration completes.
    *   **`scroll(x: number, y: number, duration?: number, ease?: MouseMoveEase): Promise<void>`**: Simulates mouse wheel scrolling.
        *   `x`, `y`: Amount to scroll horizontally and vertically.
        *   `duration` (optional, default `100`ms): Time taken for the scroll.
        *   `ease` (optional, default `"linear"`): Easing function for the scroll animation.
        *   Returns a promise that resolves when the scroll duration completes.
*   **`keyboard: KeyboardSimulator`**: Accessor for keyboard simulation methods.
    *   **`press(key: string)`**: Simulates pressing down a specific key.
    *   **`release(key: string)`**: Simulates releasing a specific key.
    *   **`tap(key: string)`**: Simulates a quick press and release of a key.
    *   **`type(text: string)`**: Simulates typing a string of text.
