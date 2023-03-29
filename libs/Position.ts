import {
    exitFeeTraders,
    exitFeeLPs,
    oddsNewPositionIsLp,
    Token,
} from './Constants';
import { 
    Budget, 
    Player 
} from './Player';
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
    }

    withdraw(amount: number) {
        const feesToPay = amount * this.exitFee;
        this.feesPaid += feesToPay;
        this.amountWithdrawn += amount - feesToPay;
    }

    get earnsFees():boolean {
        // if this player has another position in this market, 
        // with the opposite direction, 
        // with a liquidation value at least 10% of this liquidation value, 
        // then return true
        const otherPositions = this.market.positions.filter(position => position.player === this.player && position.direction !== this.direction);
        return otherPositions.some(position => position.liquidationValue > this.liquidationValue * 0.1);
    }

    get long():number {
        return (this.direction === Direction.long) ? this.liquidationValue : 0;
    }

    get short():number {
        return (this.direction === Direction.short) ? this.liquidationValue : 0;
    }

    get exitFee():number {
        return (this.earnsFees) ? exitFeeLPs : exitFeeTraders;
    }

    get feesOwed():number {
        return (this.amountDeposited - this.amountWithdrawn - this.feesPaid) * this.exitFee;
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