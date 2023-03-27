import * as namer from "random-name";

export class Player {
    name: string;           // random name
    riskTolerance: number;  // 0 to 1, 0 is no risk, 1 is 100% risk
   
    constructor() {
      this.name = namer.first() + " " + namer.middle() + " " + namer.last();
      this.riskTolerance = Math.random();
    }
}