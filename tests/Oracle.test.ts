import { Oracle } from '../libs/Oracle';
import { expect } from 'chai';

describe("Oracles", () => {
    it("should be created with a random reference price", () => {
        const oracle = new Oracle();
        expect(oracle.referencePrice).to.be.a("number");
    });
    it("should generate a new reference price everytime the reference price is referenced", () => {
        const oracle = new Oracle();
        const prices: Array<number> = [];
        for (let i = 0; i < 10000; i++) {
            prices.push(oracle.referencePrice);
        }

        const isUnique = (arrToTest) => arrToTest.length === new Set(arrToTest).size
        expect(isUnique(prices)).to.be.true;
    });
});
