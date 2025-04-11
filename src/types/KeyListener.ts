import { EventEmitter } from "stream";
import cp from "child_process";
import process from "process";
import path from "path";
import JSONStream from "json-stream";
import { modulePath } from "..";

export type KeyListenerType = "DIRECT" | "COMPLEX" | "HOLD_AND_RELEASE" | "MOUSE";

export type EventTypes = {
  ["DIRECT"]: {
    key: string;
    pressed: boolean;
    timestamp: number;
    event_type: "direct";
  },
  ["COMPLEX"]: {
    keys: string[];
    timestamp: number;
    event_type: "press" | "combination";
  },
  ["HOLD_AND_RELEASE"]: {
    keys: string[];
    start_time: number;
    end_time: number;
    duration_ms: number;
    event_type: "key_sequence";
  },
  ["MOUSE"]: ({
    event_type: "move";
  } | {
    button: string;
    pressed: boolean;
    event_type: "button";
  }) & {
    x: number;
    y: number;
    timestamp: number;
  }
}

export type EventTypeToDataMap = {
  // Direct event types
  "direct": EventTypes["DIRECT"];

  // Complex event types
  "press": EventTypes["COMPLEX"] & { event_type: "press" };
  "combination": EventTypes["COMPLEX"] & { event_type: "combination" };

  // Hold and release event types
  "key_sequence": EventTypes["HOLD_AND_RELEASE"];

  // Mouse event types
  "move": Extract<EventTypes["MOUSE"], { event_type: "move" }>;
  "button": Extract<EventTypes["MOUSE"], { event_type: "button" }>;
}

export type KeyListenerEventTypes = {
  ["DIRECT"]: ["DIRECT"],
  ["COMPLEX"]: ["DIRECT", "COMPLEX"],
  ["HOLD_AND_RELEASE"]: ["HOLD_AND_RELEASE"],
  ["MOUSE"]: ["MOUSE"]
}

export type KeyListenerEventMap<T extends KeyListenerType> =
  EventTypes[KeyListenerEventTypes[T][number]];

export class KeyListener<T extends KeyListenerType> extends EventEmitter {
  process: cp.ChildProcessWithoutNullStreams | null = null;
  jsonStream: ReturnType<typeof JSONStream> | null = null;
  started: boolean = false;

  constructor(public type: T) {
    super();
  }

  on(event: "raw", listener: (data: any) => void): this;
  on<TCurrent extends EventTypes[KeyListenerEventTypes[T][number]]["event_type"]>(
    event: TCurrent,
    listener: (data: EventTypeToDataMap[TCurrent]) => void
  ): this;

  on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  async start() {
    if (this.started) return false;
    this.started = true;

    this.process = cp.spawn(
      path.resolve(modulePath, process.platform === "win32" ? "./key-listener.exe" : "./key-listener"),
      [this.type],
      {
        shell: true
      }
    );

    this.jsonStream = JSONStream();
    this.process.stdout.pipe(this.jsonStream);
    this.jsonStream.on("data", (data) => {
      this.emit("raw", data);
      this.emit(data.event_type, data);
    });

    return true;
  }

  async stop() {
    if (!this.started) return false;
    this.started = false;

    this.process?.kill();
    this.process?.removeAllListeners();
    this.jsonStream?.destroy();
    this.jsonStream?.removeAllListeners();
    this.process = null;
    this.jsonStream = null;

    return true;
  }
}

const l = new KeyListener("MOUSE");
