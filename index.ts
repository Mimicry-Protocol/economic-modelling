import { Market } from "./montecarlo/libs/Market";
import { Budget, Player } from "./montecarlo/libs/Player";
import { Direction } from "./montecarlo/libs/Position";
import { 
    oddsNewPositionIsLp,
    oddsAddCollateral,
    oddsRemoveCollateral,
} from "./montecarlo/libs/Constants";

const doodles = new Market("Doodles");
const players = 5;
const iterations = 100;

for (let i = 0; i < players; i++) {
    const player = new Player();
    
    if (oddsNewPositionIsLp > Math.random()) {
        doodles.openPosition(player, Direction.long);
        doodles.openPosition(player, Direction.short);
    } else {
        doodles.openPosition(player);
    }

    for (let j = 0; j < iterations; j++) {
        doodles.valueTranferEvent();

        if (oddsAddCollateral > Math.random()) {
            // Get a random position from the player
            const position = player.positions[Math.floor(Math.random() * player.positions.length)];
            position.deposit(Math.random() * player.budget);
        }

        if (oddsRemoveCollateral > Math.random()) {
            // Get a random position from the player
            const position = player.positions[Math.floor(Math.random() * player.positions.length)];
            position.withdraw(Math.random() * position.value);
        }
    }
}

for (const position of doodles.positions) {
    position.close();
}

for (const player of doodles.players) {
    console.log(player.name + " " + player.budget + " " + player.netProfit);
}

console.log(doodles.feesEarned);
