# System User Input

A Node.js library for capturing user input events at the system level.

## Introduction

This library provides a way to listen for and capture keyboard and mouse events globally on the system. It supports different types of key listeners, including:

*   **Direct Key Listener:** Captures individual key presses and releases.
*   **Complex Key Listener:** Captures complex key combinations.
*   **Hold and Release Listener:** Captures key sequences with hold and release timings.
*   **Mouse Listener:** Captures mouse movements and button presses.

**This library is compatible with both Windows and Linux operating systems.**

## Installation

```bash
pnpm install system-user-input
```

## Usage

```typescript
import { ComplexKeyListener } from "system-user-input";

const listener = new ComplexKeyListener();

listener.on("direct", (event) => {
  console.log(event);
});

listener.on("press", (event) => {
  console.log(event);
});

listener.start();

// Stop the listener after some time
setTimeout(() => {
  listener.stop();
}, 10000);
```

## API Reference and Usage Examples

### `KeyListener`

The base class for all key listeners.  You typically won't use this class directly, but rather one of its subclasses.

*   **`constructor(type: KeyListenerType)`**: Creates a new key listener of the specified type.
*   **`start(): Promise<boolean>`**: Starts listening for events.  Returns `true` on success, `false` on failure.
*   **`stop(): Promise<boolean>`**: Stops listening for events. Returns `true` on success, `false` on failure.
*   **`on(event: string, listener: (data: any) => void): this`**: Adds a listener for the specified event.  The `event` parameter is a string representing the event type.  The `listener` parameter is a function that will be called when the event occurs.

### `DirectKeyListener`

Captures individual key presses and releases.

```typescript
import { DirectKeyListener } from "system-user-input";

const listener = new DirectKeyListener();

listener.on("direct", (event) => {
  console.log(`Key '${event.key}' was ${event.pressed ? 'pressed' : 'released'}`);
});

listener.start();
```

*   **`isPressed(...keys: string[]): boolean`**: Checks if all the specified keys are currently pressed.
    ```typescript
    listener.isPressed("Shift", "A"); // Returns true if Shift and A are both pressed
    ```
*   **`keyPressedSince(key: string): number`**: Returns the timestamp (in milliseconds since the epoch) of when the key was last pressed, or `0` if it's not pressed.
    ```typescript
    const lastPressed = listener.keyPressedSince("A");
    if (lastPressed > 0) {
      console.log(`Key 'A' was last pressed at ${new Date(lastPressed).toLocaleString()}`);
    }
    ```

### `ComplexKeyListener`

Captures complex key combinations.  It emits "press" events for individual key presses and "combination" events for complex key combinations.

```typescript
import { ComplexKeyListener } from "system-user-input";

const listener = new ComplexKeyListener();

listener.on("press", (event) => {
  console.log(`Key '${event.keys[0]}' was pressed`);
});

listener.on("combination", (event) => {
  console.log(`Combination ${event.keys.join(" + ")} was pressed`);
});

listener.start();
```

### `MouseListener`

Captures mouse movements and button presses.

```typescript
import { MouseListener } from "system-user-input";

const listener = new MouseListener();

listener.on("move", (event) => {
  console.log(`Mouse moved to x:${event.x}, y:${event.y}`);
});

listener.on("button", (event) => {
  console.log(`Button '${event.button}' was ${event.pressed ? 'pressed' : 'released'}`);
});

listener.start();
```

*   **`isPressed(...buttons: string[]): boolean`**: Checks if all the specified mouse buttons are currently pressed.
    ```typescript
    listener.isPressed("left", "right"); // Returns true if left and right mouse buttons are both pressed
    ```
*   **`keyPressedSince(button: string): number`**: Returns the timestamp (in milliseconds since the epoch) of when the button was last pressed, or `0` if it's not pressed.
    ```typescript
    const lastPressed = listener.keyPressedSince("left");
    ```
*   **`position: { x: number; y: number; lastMoveAt: number }`**:  An object containing the current mouse `x` and `y` coordinates, and the timestamp of the last move event.
    ```typescript
    console.log(`Current mouse position: x:${listener.position.x}, y:${listener.position.y}`);
    ```
