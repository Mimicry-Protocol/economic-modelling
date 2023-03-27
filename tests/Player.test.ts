import { Player } from '../libs/Player';
import { expect } from 'chai';

describe("Players", () => {   
    it("should be created with a random name and risk tolerance", () => {
        const player = new Player();
        expect(player.name).to.be.a("string");
        expect(player.riskTolerance).to.be.a("number");
    });
});