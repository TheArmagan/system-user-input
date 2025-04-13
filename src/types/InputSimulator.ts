import cp from "child_process";
import process from "process";
import path from "path";
import { modulePath } from "..";

export class InputSimulator {
  process: cp.ChildProcessWithoutNullStreams | null = null;
  started: boolean = false;
  mouse: MouseSimulator;
  keyboard: KeyboardSimulator;

  constructor() {
    this.mouse = new MouseSimulator(this);
    this.keyboard = new KeyboardSimulator(this);
  }

  async start() {
    if (this.started) return false;
    this.started = true;

    this.process = cp.spawn(
      path.resolve(modulePath, process.platform === "win32" ? "./key-listener.exe" : "./key-listener"),
      ["SIMULATION"],
      {
        shell: true
      }
    );

    this.process.stdin.setDefaultEncoding("utf-8");
    return true;
  }

  async stop() {
    if (!this.started) return false;
    this.started = false;

    this.process?.kill();
    this.process?.removeAllListeners();
    this.process = null;
    return true;
  }

  send(data: any) {
    if (!this.process) return;
    this.process.stdin.write(`${JSON.stringify(data)}\n`);
  }

}

export type MouseButton = "left" | "right" | "middle";

export type MouseMoveEase = "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutQuad" | "easeInCubic" | "easeOutCubic" | "easeInOutCubic" | "easeInSine" | "easeOutSine" | "easeInOutSine";

class MouseSimulator {
  constructor(private simulator: InputSimulator) { }

  click(button: MouseButton = "left") {
    this.simulator.send({ event_type: "mouse", action: "click", button });
  }

  press(button: MouseButton = "left") {
    this.simulator.send({ event_type: "mouse", action: "press", button });
  }

  release(button: MouseButton = "left") {
    this.simulator.send({ event_type: "mouse", action: "release", button });
  }

  async move(x: number, y: number, duration: number = 100, ease: MouseMoveEase = "linear") {
    this.simulator.send({
      event_type: "mouse",
      action: "move",
      x,
      y,
      duration_ms: duration,
      ease
    });
    if (duration) await new Promise((r) => setTimeout(r, duration));
  }

  async scroll(x: number, y: number, duration: number = 100, ease: MouseMoveEase = "linear") {
    this.simulator.send({
      event_type: "mouse",
      action: "scroll",
      x,
      y,
      duration_ms: duration,
      ease
    });
    if (duration) await new Promise((r) => setTimeout(r, duration));
  }
}

class KeyboardSimulator {
  constructor(private simulator: InputSimulator) { }

  press(key: string) {
    this.simulator.send({ event_type: "keyboard", action: "press", key });
  }

  release(key: string) {
    this.simulator.send({ event_type: "keyboard", action: "release", key });
  }

  tap(key: string) {
    this.simulator.send({ event_type: "key", action: "tap", key });
  }

  type(text: string) {
    this.simulator.send({ event_type: "text", text });
  }
}