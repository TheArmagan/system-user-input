import { KeyListener } from "./KeyListener";

export class HoldAndReleaseListener extends KeyListener<"HOLD_AND_RELEASE"> {
  constructor() {
    super("HOLD_AND_RELEASE");
  }
}