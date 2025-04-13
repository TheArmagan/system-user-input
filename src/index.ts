import path from "path";
export const modulePath = path.resolve(__dirname);

export * from "./types/KeyListener";
export * from "./types/DirectKeyListener";
export * from "./types/HoldAndReleaseListener";
export * from "./types/ComplexKeyListener";
export * from "./types/MouseListener";
export * from "./types/InputSimulator";