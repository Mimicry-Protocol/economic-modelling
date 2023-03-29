import {
    exitFeeLPs,
    exitFeeTraders
} from '../libs/Constants';
import { Position } from '../libs/Position';
import { Market } from '../libs/Market';
import { Player } from '../libs/Player';
import { Direction } from '../libs/Position';
import { Token } from '../libs/Constants';
import { expect } from 'chai';

describe("Positions", () => {
    it("should always setup with the correct value based on the deposit amount, even when trader", () => {
        const market = new Market();
        const player = new Player();
        const position = market.openPosition(player, Direction.long, 1000);
        
        expect(position.exitFee).to.equal(exitFeeTraders);
        expect(position.amountDeposited).to.equal(1000);
        expect(position.amountWithdrawn).to.equal(0);
        expect(position.feesPaid).to.equal(0);
        expect(position.feesEarned).to.equal(0);
        expect(position.feesOwed).to.equal((1000 - 0) * exitFeeTraders);
        expect(position.liquidationValue).to.equal(1000 - position.feesOwed);
        expect(position.realizedProfit).to.equal(0);
        expect(position.unrealizedProfit).to.equal(0 - position.feesOwed);
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
