import { expect } from 'chai';
import { Market } from '../libs/Market';
import { Director } from '../libs/Director';
import { Player } from '../libs/Player';
import { Direction } from '../libs/Position';

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

});
