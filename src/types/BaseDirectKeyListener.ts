import { EventTypeToDataMap, KeyListener } from "./KeyListener";

export class BaseDirectKeyListener<T extends "DIRECT" | "COMPLEX"> extends KeyListener<T> {
  pressedKeys: Map<string, number> = new Map();
  constructor(public type: T) {
    super(type);
  }

  private _onDirectKeyPress(data: EventTypeToDataMap["direct"]) {
    if (data.pressed) {
      this.pressedKeys.set(data.key, Date.now());
    } else {
      this.pressedKeys.delete(data.key);
    }
  }

  async start() {
    if (!super.start()) return false;
    this.on("direct", this._onDirectKeyPress.bind(this));
    return true;
  }

  async stop() {
    if (!super.stop()) return false;
    this.off("direct", this._onDirectKeyPress.bind(this));
    return true;
  }

  isPressed(...keys: string[]) {
    return keys.every((key) => this.pressedKeys.has(key));
  }

  keyPressedSince(key: string) {
    return this.pressedKeys.get(key) ?? 0;
  }
}