import { 
    Budget,
    Player 
} from '../libs/Player';
import { expect } from 'chai';

describe("Players", () => {   
    // should have a name and budget
    it("should have a name and budget", () => {
        const player = new Player("Test Player", Budget.low);
        expect(player.name).to.be.a("string");
        expect(player.budget).to.equal(Budget.low);
        expect(player.name).to.equal("Test Player");
    });
});