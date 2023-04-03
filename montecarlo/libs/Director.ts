import * as _ from 'lodash';
import * as namer from "random-name";
import { Market } from './Market';
import { Player } from './Player';

export class Director extends Player {
    markets: Market[];

    constructor(
        _name: string = namer.first() + " " + namer.middle() + " " + namer.last()
    ) {
        super(_name);
        this.markets = [];
    }

    // This is called from the Market.replaceDirector
    addMarket(market: Market = new Market()) {
        this.markets.push(market);
    }

    // This is called from the Market.replaceDirector
    removeMarket(market: Market) {
        this.markets = this.markets.filter(m => m !== market);
    }

    // TODO: Add a method to get the total fees earned by all markets
    // TODO: Add a method to get the total fees earned by a specific market
}