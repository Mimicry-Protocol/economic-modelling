import * as _ from 'lodash';
import * as namer from "random-name";
import { Token } from './Token';
import { Oracle } from './Oracle';
import { Direction, Position } from './Position';
import { Player } from './Player';
import { Director } from './Director';
import { percentageOfMarketFeesToDirector } from './Constants';

export interface Skew {
    long: number;
    short: number;
}

export class Market {
    name: string;
    director: Director;
    lastReferencePrice: number;
    oracle: Oracle;
    positions: Position[]   = [];
    players: Player[]       = [];
    skew: Skew              = { long: 0, short: 0 };
    block: number           = 0;   // Represents the current block number for tracking time

    constructor(
        _name: string = namer.place(),
        _director: Director = new Director(),
    ) {
        this.name = _name;
        this.oracle = new Oracle();
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

    // This is called from position.deposit
    increaseSkew(direction:Direction, amount: number) {
        this.skew[direction] += amount;
        this.valueTranferEvent(0);
    }

    // This is called from position.withdraw
    decreaseSkew(direction:Direction, amount: number) {
        this.skew[direction] -= amount;
        this.valueTranferEvent(0);
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

    captureAndDistributeFees(fee: number) {
        this.director.captureFees(fee * percentageOfMarketFeesToDirector);
        this.payFeesToLps(fee * (1 - percentageOfMarketFeesToDirector));
    }

    payFeesToLps(fee: number) {
        // Get a list of positions that earn fees
        const positions = _.filter(this.positions, (position:Position) => {
            return position.earnsFees === true && position.value > 0;
        });
        // Then pay the fees to the LPs, proportionally to their position size
        const totalAmount = _.sumBy(positions, (position:Position) => {
            return position.value;
        });
        _.forEach(positions, (position:Position) => {
            const amount = position.value;
            const percentage = amount / totalAmount;
            const amountFeesPaid = fee * percentage;
            position.captureFees(amountFeesPaid);
        });
    }

    closePositions() {
        _.forEach(this.positions, (position:Position) => {
            position.close();
        });
    }

    get multipliers():Skew {
        // get the multiplier for each direction from the positions in the market
        const longMultiplier = _.sumBy(this.positions, (position:Position) => {
            return (position.direction === Direction.long) ? position.multiplier : 0;
        });
        const shortMultiplier = _.sumBy(this.positions, (position:Position) => {
            return (position.direction === Direction.short) ? position.multiplier : 0;
        });
        return {long: longMultiplier, short: shortMultiplier};
    }

    get feesEarned():number {
        // Fees paid by all positions
        return _.sumBy(this.positions, (position:Position) => {
            return position.amountFeesPaid;
        });
    }

    get referencePrice():number {
        return this.oracle.referencePrice;
    }

    // TODO: Add method to caculate the skew of the market
    // TODO: Add method to caculate the fees earned by the director
    // TODO: Add method to caculate the fees paid by the Actors
    // TODO: Add method to caculate the fees paid by the Producers
}