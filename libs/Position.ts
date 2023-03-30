import {
    exitFeeTraders,
    exitFeeLPs,
} from './Constants';
import {  
    Player 
} from './Player';
import { Token } from './Token';
import { Market } from './Market';
import * as _ from 'lodash';

export enum Direction {
    long = 'long',
    short = 'short'
};

export class Position {
    market: Market;
    player: Player;
    direction: Direction;
    amountDeposited: number;
    token: Token;
    amountWithdrawn: number;
    feesEarned: number;
    feesPaid: number;

    constructor(
        _market: Market,
        _player: Player,
        _direction: Direction,
        _amount: number,
        _token: Token,
    ) {
        this.market = _market;
        this.player = _player;
        this.direction = _direction;
        this.token = _token;
        //
        this.player.addPosition(this);
        this.market.addPosition(this);
        this.market.addPlayer(this.player);
        //
        this.amountDeposited = 0;
        this.amountWithdrawn = 0;
        this.feesEarned = 0;
        this.feesPaid = 0;

        this.deposit(_amount);
    }

    deposit(amount: number) {
        this.amountDeposited += amount;

        if (this.direction === Direction.long) {
            this.market.increaseLongs(amount);
        } else {
            this.market.increaseShorts(amount);
        }

        this.market.valueTranferEvent(0);
    }

    withdraw(amount: number) {
        const feesToPay = amount * this.exitFeeRatio;
        this.feesPaid += feesToPay;
        this.amountWithdrawn += amount - feesToPay;

        this.market.valueTranferEvent(0);
    }

    get positionValueBeforeFees():number {
        return this.amountDeposited - this.amountWithdrawn;
    }

    get earnsFees():boolean {
        // Get the total amount long and short that this player has in this market
        const positions = this.player.positions.filter(position => position.market === this.market);
        const totalLong = positions.reduce((acc, position) => acc + position.long, 0);
        const totalShort = positions.reduce((acc, position) => acc + position.short, 0);

        // If each side is within 90% of each other, then return true
        const percentageDifference = Math.abs(totalLong - totalShort) / Math.max(totalLong, totalShort) * 100;
        return percentageDifference <= 90;
    }

    get long():number {
        return (this.direction === Direction.long) ? this.positionValueBeforeFees : 0;
    }

    get short():number {
        return (this.direction === Direction.short) ? this.positionValueBeforeFees : 0;
    }

    get exitFeeRatio():number {
        return (this.earnsFees) ? exitFeeLPs : exitFeeTraders;
    }

    get feesOwed():number {
        return (this.amountDeposited - this.amountWithdrawn - this.feesPaid) * this.exitFeeRatio;
    }

    get unrealizedProfit():number {
        return this.liquidationValue - this.amountDeposited + this.amountWithdrawn;
    }

    get realizedProfit():number {
        // TODO: Implement this
        return 0;
    }

    get liquidationValue():number {
        return this.amountDeposited - this.amountWithdrawn - this.feesPaid - this.feesOwed;
    }
}