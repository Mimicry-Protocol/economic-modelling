import {
    exitFeeLPs,
    exitFeeTraders
} from '../libs/Constants';
import { Position } from '../libs/Position';
import { Market } from '../libs/Market';
import { Player } from '../libs/Player';
import { Direction } from '../libs/Position';
import { Token } from '../libs/Token';
import { expect } from 'chai';

describe("Positions", () => {
    it("should always setup with the correct value based on the deposit amount, even when trader", () => {
        const market = new Market();
        const player = new Player();
        const position = market.openPosition(player, Direction.long, 1000);
        
        expect(position.exitFeeRatio).to.equal(exitFeeTraders);
        expect(position.amountDeposited).to.equal(1000);
        expect(position.amountWithdrawn).to.equal(0);
        expect(position.feesPaid).to.equal(0);
        expect(position.feesEarned).to.equal(0);
        expect(position.feesOwed).to.equal((1000 - 0) * exitFeeTraders);
        expect(position.liquidationValue).to.equal(1000 - position.feesOwed);
        expect(position.realizedProfit).to.equal(0);
        expect(position.unrealizedProfit).to.equal(0 - position.feesOwed);
    });
    it("should earn fees if a player has a two-sided position of similar sizes in the same market", () => {
        // if this player has another position in this market, 
        // with the opposite direction, 
        // with a liquidation value at least 10% of this liquidation value, 
        // then return true
        const market = new Market();
        const player1 = new Player("Player 1");
        const player2 = new Player("Player 2");
        const player3 = new Player("Player 3");
        const player4 = new Player("Player 4");
        const position1 = market.openPosition(player1, Direction.long, 1000);
        const position2 = market.openPosition(player1, Direction.short, 99);
        const position3 = market.openPosition(player1, Direction.short, 1);
        const position4 = market.openPosition(player2, Direction.long, 100);
        const position5 = market.openPosition(player2, Direction.short, 1);
        const position6 = market.openPosition(player3, Direction.long, 1000);
        const position7 = market.openPosition(player4, Direction.long, 1000);
        const position8 = market.openPosition(player4, Direction.short, 100);
        const position9 = market.openPosition(player4, Direction.long, 1);
        expect(position1.earnsFees).to.equal(true);
        expect(position2.earnsFees).to.equal(true);
        expect(position3.earnsFees).to.equal(true);
        expect(position4.earnsFees).to.equal(false);
        expect(position5.earnsFees).to.equal(false);
        expect(position6.earnsFees).to.equal(false);
        expect(position7.earnsFees).to.equal(false);
        expect(position8.earnsFees).to.equal(false);
        expect(position9.earnsFees).to.equal(false);
        
    });

    // it("should always setup with the correct value based on the deposit amount, even when LP", () => {
    //     const market = new Market();
    //     const player = new Player();
    //     const position = market.openPosition(player, Direction.long, 1000);

    //     expect(position.exitFee).to.equal(exitFeeLPs);
    //     expect(position.amountDeposited).to.equal(1000);
    //     expect(position.amountWithdrawn).to.equal(0);
    //     expect(position.feesPaid).to.equal(0);
    //     expect(position.feesEarned).to.equal(0);
    //     expect(position.feesOwed).to.equal((1000 - 0) * exitFeeLPs);
    //     expect(position.liquidationValue).to.equal(1000 - position.feesOwed);
    //     expect(position.realizedProfit).to.equal(0);
    //     expect(position.unrealizedProfit).to.equal(0 - position.feesOwed);
    // });
    // it("should allow for withdrawing funds", () => {
    //     const market = new Market();
    //     const player = new Player();
    //     const position = market.openPosition(player, Direction.long, 1000);
    //     position.withdraw(500);

    //     expect(position.amountDeposited).to.equal(1000);
    //     expect(position.amountWithdrawn).to.equal(500 - (500 * exitFeeTraders));
    //     expect(position.feesPaid).to.equal(500 * exitFeeTraders);
    //     expect(position.feesOwed).to.equal((500) * exitFeeTraders);
    //     expect(position.liquidationValue).to.equal(500 - position.feesOwed);
    //     expect(position.unrealizedProfit).to.equal(0 - position.feesPaid - position.feesOwed);
    // });
    // it("should allow for withdrawing funds, even when LP", () => {
    //     const market = new Market();
    //     const player = new Player();
    //     const position = market.openPosition(player, Direction.long, 1000);
    //     position.withdraw(500);

    //     expect(position.amountDeposited).to.equal(1000);
    //     expect(position.amountWithdrawn).to.equal(500 - (500 * exitFeeLPs));
    //     expect(position.feesPaid).to.equal(500 * exitFeeLPs);
    //     expect(position.feesOwed).to.equal((500) * exitFeeLPs);
    //     expect(position.liquidationValue).to.equal(500 - position.feesOwed);
    //     expect(position.unrealizedProfit).to.equal(0 - position.feesPaid - position.feesOwed);
    // });

    // TODO: Add tests for over-withdrawing, and for withdrawing more than the fees owed, etc.
});
