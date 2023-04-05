import {
    exitFeeTraders,
    exitFeeLPs,
    longShortDistanceThresholdForLp,
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
    token: Token;
    amountDeposited: number     = 0;
    amountWithdrawn: number     = 0;
    amountFeesPaid: number      = 0;
    amountFeesEarned: number    = 0;
    multiplier: number          = 1;

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

        this.deposit(_amount);
    }

    deposit(amount: number) {
        this.player.budget -= amount;
        this.amountDeposited += amount;
        this.market.increaseSkew(this.direction, amount);
    }

    withdraw(amount: number) {
        // Calculate and pay the exit fee
        const exitFee = amount * this.exitFeeRatio;
        this.amountFeesPaid += exitFee;

        // Decrease the skew and multiplier
        this.multiplier -= this.multiplier * (amount / this.value);
        this.market.decreaseSkew(this.direction, amount);
        this.market.captureAndDistributeFees(exitFee);

        // Update the amount withdrawn
        const amountToWithdraw = amount - exitFee;
        this.player.budget += amountToWithdraw;
        this.amountWithdrawn += amountToWithdraw;
    }

    captureFees(amount: number) {
        this.amountFeesEarned += amount;
    }

    close() {
        this.withdraw(this.value);
        this.multiplier = 0;
    }

    get value():number {
        const amount = (this.multiplier / this.market.multipliers[this.direction]) * this.market.skew[this.direction]
        // If amount is NaN, then return 0, otherwise return amount
        return (amount === amount) ? amount : 0;
    }

    get earnsFees():boolean {
        // Get the total amount long and short that this player has in this market
        const positions = this.player.positions.filter(position => position.market === this.market);
        const totalLong = positions.reduce((acc, position) => acc + position.long, 0);
        const totalShort = positions.reduce((acc, position) => acc + position.short, 0);

        // If each side is within a certain percentage of each other, then return true
        const percentageDifference = Math.abs(totalLong - totalShort) / Math.max(totalLong, totalShort) * 100;
        return percentageDifference <= (longShortDistanceThresholdForLp * 100);
    }

    get long():number {
        return (this.direction === Direction.long) ? this.value : 0;
    }

    get short():number {
        return (this.direction === Direction.short) ? this.value : 0;
    }

    get exitFeeRatio():number {
        return (this.earnsFees) ? exitFeeLPs : exitFeeTraders;
    }

    get feesOwed():number {
        return this.value * this.exitFeeRatio;
    }

    get unrealizedProfit():number {
        return (this.multiplier === 0) ? 0 : this.value - this.amountDeposited + this.amountWithdrawn - this.feesOwed;
    }

    get realizedProfit():number {
        return (this.multiplier > 0) ? 0 : this.amountWithdrawn - this.amountDeposited;
    }

    get liquidationValue():number {
        return this.value - this.feesOwed;
    }
}