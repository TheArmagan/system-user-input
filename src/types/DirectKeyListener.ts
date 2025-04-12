import { BaseDirectKeyListener } from "./BaseDirectKeyListener";

export class DirectKeyListener extends BaseDirectKeyListener<"DIRECT"> {
  constructor() {
    super("DIRECT");
  }
}