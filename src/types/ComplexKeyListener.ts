import { BaseDirectKeyListener } from "./BaseDirectKeyListener";

export class ComplexKeyListener extends BaseDirectKeyListener<"COMPLEX"> {
  constructor() {
    super("COMPLEX");
  }
}