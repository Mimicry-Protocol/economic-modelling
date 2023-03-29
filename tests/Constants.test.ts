import {
    oracleMaxBearShiftPerPeriod,
    oracleMaxBullShiftPerPeriod,
    oraclePriceMin,
    oraclePriceMax,
    exitFeeTraders,
    exitFeeLPs,
    oddsNewPositionIsLp,


    timePeriods,
    minNumNewPositionsPerPeriod,
    maxNumNewPositionsPerPeriod,
    referencePriceMaxShiftDownPerPeriod,
    referencePriceMaxShiftUpPerPeriod,
    oddsAddCollateral,
    oddsRemoveCollateral,
} from '../libs/Constants';
import { expect } from 'chai';

describe("Constants", () => {
    it ("should have a valid oracleMaxBearShiftPerPeriod", () => {
        expect(oracleMaxBearShiftPerPeriod).to.be.a("number");
        expect(oracleMaxBearShiftPerPeriod).to.be.greaterThan(0);
        expect(oracleMaxBearShiftPerPeriod).to.be.lessThanOrEqual(.2);
    });
    it ("should have a valid oracleMaxBullShiftPerPeriod", () => {
        expect(oracleMaxBullShiftPerPeriod).to.be.a("number");
        expect(oracleMaxBullShiftPerPeriod).to.be.greaterThan(0);
        expect(oracleMaxBullShiftPerPeriod).to.be.lessThanOrEqual(.2);
    });
    it ("should have a valid oraclePriceMin", () => {
        expect(oraclePriceMin).to.be.a("number");
        expect(oraclePriceMin).to.be.greaterThan(0);
    });
    it ("should have a valid oraclePriceMax", () => {
        expect(oraclePriceMax).to.be.a("number");
        expect(oraclePriceMax).to.be.greaterThan(0);
    });
    it ("should have a valid exitFeeTraders", () => {
        expect(exitFeeTraders).to.be.a("number");
        expect(exitFeeTraders).to.be.greaterThanOrEqual(0);
        expect(exitFeeTraders).to.be.lessThan(0.01);
    });
    it ("should have a valid exitFeeLPs", () => {
        expect(exitFeeLPs).to.be.a("number");
        expect(exitFeeLPs).to.be.greaterThanOrEqual(0);
        expect(exitFeeLPs).to.be.lessThan(0.01);
    });
    it ("should have a valid oddsNewPositionIsLp", () => {
        expect(oddsNewPositionIsLp).to.be.a("number");
        expect(oddsNewPositionIsLp).to.be.greaterThanOrEqual(0);
        expect(oddsNewPositionIsLp).to.be.lessThanOrEqual(1);
    });




    it ("should have a valid timePeriods", () => {
        expect(timePeriods).to.be.a("number");
        expect(timePeriods).to.be.greaterThan(0);
    });
    it ("should have a valid minNumNewPositionsPerPeriod", () => {
        expect(minNumNewPositionsPerPeriod).to.be.a("number");
        expect(minNumNewPositionsPerPeriod).to.be.greaterThan(0);
    });
    it ("should have a valid maxNumNewPositionsPerPeriod", () => {
        expect(maxNumNewPositionsPerPeriod).to.be.a("number");
        expect(maxNumNewPositionsPerPeriod).to.be.greaterThan(0);
    });
    it ("should have a valid referencePriceMaxShiftDownPerPeriod", () => {
        expect(referencePriceMaxShiftDownPerPeriod).to.be.a("number");
        expect(referencePriceMaxShiftDownPerPeriod).to.be.greaterThan(0);
        expect(referencePriceMaxShiftDownPerPeriod).to.be.lessThan(1);
    });
    it ("should have a valid referencePriceMaxShiftUpPerPeriod", () => {
        expect(referencePriceMaxShiftUpPerPeriod).to.be.a("number");
        expect(referencePriceMaxShiftUpPerPeriod).to.be.greaterThan(0);
        expect(referencePriceMaxShiftUpPerPeriod).to.be.lessThan(1);
    });
    it ("should have a valid oddsAddCollateral", () => {
        expect(oddsAddCollateral).to.be.a("number");
        expect(oddsAddCollateral).to.be.greaterThan(0);
        expect(oddsAddCollateral).to.be.lessThan(1);
    });
    it ("should have a valid oddsRemoveCollateral", () => {
        expect(oddsRemoveCollateral).to.be.a("number");
        expect(oddsRemoveCollateral).to.be.greaterThan(0);
        expect(oddsRemoveCollateral).to.be.lessThan(1);
    });
});