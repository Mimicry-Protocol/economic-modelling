import {
    minDepositAmount,
    maxDepositAmount,
    exitFeeTraders,
    exitFeeLPs,
    oddsNewPositionIsLp,
} from './Constants';
import * as _ from 'lodash';

enum Direction {
    long = 'long',
    short = 'short'
}; 

export class Position {
    direction: Direction;
    earnsFees: boolean;
    amountDeposited: number;
    amountWithdrawn: number;
    feesEarned: number;
    feesPaid: number;

    constructor(
        _amount: number = _.random(minDepositAmount, maxDepositAmount),
        _earnsFees: boolean = (Math.random() <= oddsNewPositionIsLp) ? true : false,
        _direction: Direction = (Math.random() < 0.5) ? Direction.long : Direction.short,
    ) 
    {
        this.direction = _direction;
        this.earnsFees = _earnsFees;
        this.amountDeposited = 0;
        this.amountWithdrawn = 0;
        this.feesEarned = 0;
        this.feesPaid = 0;

        this.deposit(_amount);
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

    deposit(amount: number) {
        this.amountDeposited += amount;
    }

    withdraw(amount: number) {
        const feesToPay = amount * this.exitFee;
        this.feesPaid += feesToPay;
        this.amountWithdrawn += amount - feesToPay;
    }
}