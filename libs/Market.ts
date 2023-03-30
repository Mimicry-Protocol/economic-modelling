import * as _ from 'lodash';
import * as namer from "random-name";
import { Token } from './Token';
import { Oracle } from './Oracle';
import { Direction, Position } from './Position';
import { Player } from './Player';
import { Director } from './Director';

export interface Skew {
    long: number;
    short: number;
}

export class Market {
    name: string;
    director: Director;
    lastReferencePrice: number;
    oracle: Oracle;
    positions: Position[];
    players: Player[];
    skew: Skew;

    constructor(
        _name: string = namer.place(),
        _director: Director = new Director(),
    ) {
        this.name = _name;
        this.oracle = new Oracle();
        this.positions = [];
        this.players = [];
        this.skew = {long: 0, short: 0};
        this.lastReferencePrice = this.referencePrice;

        this.replaceDirector(_director);
    }

    replaceDirector(director: Director): Director {
        if (this.director) {
            this.director.removeMarket(this);
        }
        this.director = director;
        this.director.addMarket(this);
        return this.director;
    }

    openPosition(
        player: Player = new Player(),
        direction: Direction = (Math.random() < 0.5) ? Direction.long : Direction.short, 
        amount: number = Math.random() * player.budget,
        token: Token = Token.USDC, 
    ):Position {
        const position:Position = new Position(this, player, direction, amount, token);
        return position;
    }

    // This is called from the position constructor
    addPosition(position: Position) {
        this.positions.push(position);
    }

    // This is called from the position constructor
    addPlayer(player: Player) {
        if (!_.includes(this.players, player)) {
            this.players.push(player);
        }
    }

    increaseLongs(amount: number) {
        this.skew.long += amount;
    }

    increaseShorts(amount: number) {
        this.skew.short += amount;
    }

    // TODO: Figure out why this sometimes allows a market to go negative
    valueTranferEvent(
        fromSide: Direction = (Math.random() < 0.5) ? Direction.long : Direction.short, 
        percentage: number = (this.referencePrice - this.lastReferencePrice) / this.lastReferencePrice,
    ) {
        const toSide = (fromSide === Direction.long) ? Direction.short : Direction.long;
        let skewTransfer = this.skew[fromSide] * percentage;
        
        // make the skew 0 if it goes negative
        if (this.skew[fromSide] - skewTransfer < 0) {
            skewTransfer = this.skew[fromSide];
        }    
        this.skew[fromSide] -= skewTransfer;
        this.skew[toSide] += skewTransfer;
    }

    get referencePrice():number {
        return this.oracle.referencePrice;
    }

    // TODO: Add method to caculate the skew of the market
    // TODO: Add method to caculate the fees earned by the director
    // TODO: Add method to caculate the fees paid by the Actors
    // TODO: Add method to caculate the fees paid by the Producers
}