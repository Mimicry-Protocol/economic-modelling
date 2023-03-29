import { Market } from "./libs/Market";
import { Direction } from "./libs/Position";

const doodles = new Market("Doodles");
for (let i = 0; i < 10000; i++) {
  doodles.openPosition();
  doodles.valueTranferEvent();
}

console.log(doodles.skew);
