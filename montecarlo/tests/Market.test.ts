import { expect } from 'chai';
import { Market, Skew } from '../libs/Market';
import { Director } from '../libs/Director';
import { Player } from '../libs/Player';
import { Direction } from '../libs/Position';
import { exitFeeTraders, exitFeeLPs, percentageOfMarketFeesToDirector } from '../libs/Constants';


describe("Markets", () => {
    it("should have the ability to replace a director", () => {
        const market = new Market();
        const oldDirector = market.director;
        const newDirector = new Director();
        market.replaceDirector(newDirector);
        expect(market.director).to.equal(newDirector);
        expect(oldDirector.markets).to.not.include(market);
        expect(newDirector.markets).to.include(market);
    });
    it("should have a list of players after opening a position", () => {
        const market = new Market();
        const player = new Player();
        market.openPosition(player, Direction.long, 100);
        expect(market.players).to.include(player);
    });
    it("should have the ability to open a position", () => {
        const market = new Market();
        const player = new Player();
        const position = market.openPosition(player);
        expect(market.positions).to.include(position);
        expect(player.positions).to.include(position);
    });
    it("should update their long skew when opening a long position with a specific amount", () => {
        const market = new Market();
        const player = new Player();
        const position = market.openPosition(player, Direction.long, 100);
        expect(market.skew.long).to.equal(100);
        expect(market.skew.short).to.equal(0);
    });
    it("should update their short skew when opening a short position with a specific amount", () => {
        const market = new Market();
        const player = new Player();
        const position = market.openPosition(player, Direction.short, 100);
        expect(market.skew.long).to.equal(0);
        expect(market.skew.short).to.equal(100);
    });
    it("should properly update the skews when performing a value transfer event", () => {
        const market = new Market();
        const player = new Player();
        market.openPosition(player, Direction.long, 100);
        market.openPosition(player, Direction.short, 100);
        market.valueTranferEvent(-.1);
        expect(market.skew.long).to.equal(90);
        expect(market.skew.short).to.equal(110);
        market.valueTranferEvent(.1);
        expect(market.skew.long).to.equal(101);
        expect(market.skew.short).to.equal(99);
        market.valueTranferEvent();
        expect(market.skew.long).to.not.equal(101);
        expect(market.skew.short).to.not.equal(99);
    });
    it("should not allow a value transfer event to cause one side to have a negative skew", () => {
        const market = new Market();
        const player = new Player();
        market.openPosition(player, Direction.long, 100);
        market.openPosition(player, Direction.short, 100);
        market.valueTranferEvent(1.5);
        expect(market.skew.long).to.equal(200);
        expect(market.skew.short).to.equal(0);
        market.valueTranferEvent(-1);
        expect(market.skew.long).to.equal(0);
        expect(market.skew.short).to.equal(200);
    });
    it("should be able to track position values properly after value transfer and withdraw", () => {
        const market = new Market();
        const player1 = new Player();
        const player2 = new Player();
        const position1 = market.openPosition(player1, Direction.long, 100);
        const position2 = market.openPosition(player2, Direction.short, 100);
        market.valueTranferEvent(.1);
        expect(position1.value).to.equal(110);
        expect(position2.value).to.equal(90);
        const skew1: Skew = {long: 1, short: 1};
        expect(market.multipliers.long).to.equal(market.multipliers.short);
        position1.withdraw(100);
        expect(position1.value).to.equal(10);
        expect(position2.value).to.equal(90);
        expect(market.multipliers.long).to.approximately(10/110, .0001);
        expect(market.multipliers.short).to.equal(1);
    });
    it("should have variable multipliers depending on the order of positions opened", () => {
        const market = new Market();
        const Alice = new Player();
        const Bob = new Player();
        const Charlie = new Player();
        const position1 = market.openPosition(Alice, Direction.long, 1000);
        const position2 = market.openPosition(Bob, Direction.long, 500);
        const position3 = market.openPosition(Charlie, Direction.short, 200);
        expect(position1.multiplier).to.equal(position2.multiplier * 2);
        position1.withdraw(400);
        expect(position1.value).to.approximately(600, .0001);
        position2.deposit(250);
        expect(position2.value).to.approximately(750, .0001);
        expect(position3.value).to.equal(200);
    });
    it("should take exit fees properly depending on trader or LP", () => {
        const market = new Market();
        const player1 = new Player();
        const player2 = new Player();
        const position1 = market.openPosition(player1, Direction.long, 1000);
        const position2 = market.openPosition(player1, Direction.short, 1000);
        const position3 = market.openPosition(player2, Direction.short, 1000);
        expect(position1.earnsFees).to.equal(true);
        expect(position2.earnsFees).to.equal(true);
        expect(position3.earnsFees).to.equal(false);
        position1.withdraw(100);
        position3.withdraw(100);
        expect(position1.value).to.equal(900);
        expect(position3.value).to.equal(900);
        expect(position1.amountFeesPaid).to.equal(100 * exitFeeLPs);
        expect(position3.amountFeesPaid).to.equal(100 * exitFeeTraders);
        expect(position1.amountWithdrawn).to.equal(100 - (100 * exitFeeLPs));
        expect(position3.amountWithdrawn).to.equal(100 - (100 * exitFeeTraders));
        expect(market.feesEarned).to.equal(position1.amountFeesPaid + position3.amountFeesPaid);
        const feesPaidToLps = (1 - percentageOfMarketFeesToDirector) * (position1.amountFeesPaid + position3.amountFeesPaid);
        expect(player1.feesEarned).to.approximately(feesPaidToLps, 0.00000001);
        expect(player2.feesEarned).to.equal(0);
        expect(market.director.feesEarned).to.approximately(percentageOfMarketFeesToDirector * (position1.amountFeesPaid + position3.amountFeesPaid), 0.00000001);
    });

});
