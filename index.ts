import { Market } from "./montecarlo/libs/Market";

const doodles = new Market("Doodles");

for (let i = 0; i < 5; i++) {
    doodles.openPosition();
    for (let j = 0; j < 50; j++) {
        doodles.valueTranferEvent();
    }
}

for (const position of doodles.positions) {
    console.log(position);
}