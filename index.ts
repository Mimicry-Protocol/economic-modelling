import { Market } from "./libs/Market";
import { Direction } from "./libs/Position";

const doodles = new Market("Doodles");

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10000; j++) {
        doodles.openPosition();
        doodles.valueTranferEvent();
    }
    console.log(doodles.skew);
}
