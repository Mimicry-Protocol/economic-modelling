import { expect } from 'chai';
import { Director } from '../libs/Director';
import { Market } from '../libs/Market';

describe("Directors", () => {
    it("should be created with a random name", () => {
        const director = new Director();
        expect(director.name).to.be.a("string");
    });
    it("should be able to add a market", () => {
        const director = new Director();
        director.addMarket();
        expect(director.markets.length).to.equal(1);
    });
    it("should be able to add multiple markets", () => {
        const director = new Director();
        director.addMarket();
        director.addMarket();
        director.addMarket();
        expect(director.markets.length).to.equal(3);
    });
    it("should be able to add a market with a specific name", () => {
        const director = new Director();
        const market = new Market("Test Market");
        director.addMarket(market);
        expect(director.markets[0].name).to.equal("Test Market");
    });
    it("should be able to remove a market", () => {
        const director = new Director();
        const market = new Market("Test Market");
        director.addMarket(market);
        director.removeMarket(market);
        expect(director.markets.length).to.equal(0);
    });
    it("should be able to remove a specific market", () => {
        const director = new Director();
        const market1 = new Market("Test Market 1");
        const market2 = new Market("Test Market 2");
        director.addMarket(market1);
        director.addMarket(market2);
        director.removeMarket(market1);
        expect(director.markets.length).to.equal(1);
        expect(director.markets[0].name).to.equal("Test Market 2");
        expect(director.markets[0].name).to.not.equal("Test Market 1");
    });
});
