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
    block: number = 0; // Represents the current block number for tracking time

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
        // TODO: Check to ensure that the player has enough budget to open a position
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

    valueTranferEvent(
        percentage: number = (this.referencePrice - this.lastReferencePrice) / this.lastReferencePrice,
    ) {
        // If the percentage is positive, then the shorts pay the longs
        // If the percentage is negative, then the longs pay the shorts
        const payer = (percentage > 0) ? Direction.short : Direction.long;
        const payee = (percentage > 0) ? Direction.long : Direction.short;
        
        let payment = Math.abs(this.skew[payer] * percentage);
        
        // make the payment equal to all the money that the payer has if the payment goes over the payer's budget
        if (this.skew[payer] - payment <= 0) {
            payment = this.skew[payer];
        }
        this.skew[payer] -= payment;
        this.skew[payee] += payment;

        // Increment the blockTime for tracking purposes
        this.block++;
    }
 
    get referencePrice():number {
        return this.oracle.referencePrice;
    }

    // TODO: Add method to caculate the skew of the market
    // TODO: Add method to caculate the fees earned by the director
    // TODO: Add method to caculate the fees paid by the Actors
    // TODO: Add method to caculate the fees paid by the Producers
}