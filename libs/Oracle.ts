import {
    oracleMaxBearShiftPerPeriod,
    oracleMaxBullShiftPerPeriod,
    oraclePriceMin,
    oraclePriceMax,
} from './Constants';
import * as _ from 'lodash';

export class Oracle {
    #referencePrice: number;

    constructor() {        
        this.#referencePrice = _.random(oraclePriceMin, oraclePriceMax);
    }

    get referencePrice() {
        this.#referencePrice *= _.random(1 - oracleMaxBearShiftPerPeriod, 
                                         1 + oracleMaxBullShiftPerPeriod);
        return this.#referencePrice;
    }
}