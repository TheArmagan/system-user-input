import { EventTypeToDataMap, KeyListener } from "./KeyListener";

export class MouseListener extends KeyListener<"MOUSE"> {
  pressedKeys: Map<string, number> = new Map();
  position: { x: number; y: number, lastMoveAt: number } = { x: 0, y: 0, lastMoveAt: 0 };

  constructor() {
    super("MOUSE");
  }

  private _onButton(data: EventTypeToDataMap["button"]) {
    if (data.pressed) {
      this.pressedKeys.set(data.button, Date.now());
    } else {
      this.pressedKeys.delete(data.button);
    }
  }

  private _onMove(data: EventTypeToDataMap["move"]) {
    this.position.x = data.x;
    this.position.y = data.y;
    this.position.lastMoveAt = data.timestamp;
  }

  async start() {
    if (!super.start()) return false;
    this.on("button", this._onButton.bind(this));
    this.on("move", this._onMove.bind(this));
    return true;
  }

  async stop() {
    if (!super.stop()) return false;
    this.off("button", this._onButton.bind(this));
    this.off("move", this._onMove.bind(this));
    return true;
  }

  isPressed(...keys: string[]) {
    return keys.every((key) => this.pressedKeys.has(key));
  }

  keyPressedSince(key: string) {
    return this.pressedKeys.get(key) ?? 0;
  }
}