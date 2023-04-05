import { Position } from "./Position";
import * as namer from "random-name";
// TODO: Upgrade namer to @faker-js/faker


export enum Budget {
    low = 10**3,     // 1,000
    medium = 10**4,  // 10,000
    high = 10**5,    // 100,000
    whale = 10**6,   // 1,000,000
}

export class Player {
    name: string;           // random name
    commitment: number;     // 0 to 1, 0 is no commitment, 1 is 100% commitment
    budget: Budget;         // low, medium, high, whale
    positions: Position[] = [];
   
    constructor(
      _name: string = namer.first() + " " + namer.middle() + " " + namer.last(), 
      _budget: Budget = (Math.random() < 0.33) ? Budget.low : (Math.random() < 0.66) ? Budget.medium : Budget.high,
    ) {
      this.name = _name;
      this.budget = _budget;
      this.positions = [];
    }

    // This is called from the position constructor
    addPosition(position: Position) {
        this.positions.push(position);
    }

    get feesEarned():number {
        return this.positions.reduce((acc, position) => acc + position.amountFeesEarned, 0);
    }

    get totalLong():number {
        return this.positions.reduce((acc, position) => acc + position.long, 0);
    }

    get totalShort():number {
        return this.positions.reduce((acc, position) => acc + position.short, 0);
    }

    get totalDeposited():number {
        return this.positions.reduce((acc, position) => acc + position.amountDeposited, 0);
    }

    get totalWithdrawn():number {
        return this.positions.reduce((acc, position) => acc + position.amountWithdrawn, 0);
    }

    get liquidationValue():number {
        return this.positions.reduce((acc, position) => acc + position.liquidationValue, 0);
    }

    get unrealizedProfit():number {
        return this.positions.reduce((acc, position) => acc + position.unrealizedProfit, 0);
    }

    get realizedProfit():number {
        return this.positions.reduce((acc, position) => acc + position.realizedProfit, 0);
    }

    get feesPaid():number {
        return this.positions.reduce((acc, position) => acc + position.amountFeesPaid, 0);
    }

    get feesOwed():number {
        return this.positions.reduce((acc, position) => acc + position.feesOwed, 0);
    }

    

    get netProfit():number {
        return this.realizedProfit + this.unrealizedProfit;
    }

    get netLoss():number {
        return this.feesPaid + this.feesOwed;
    }

    get netFees():number {
        return this.feesEarned - this.feesPaid;
    }

    get netWinnings():number {
        return this.netProfit - this.netLoss;
    }

    get netWinningsAfterFees():number {
        return this.netWinnings - this.netFees;
    }

    get netWinningsAfterFeesPercent():number {
        return this.netWinningsAfterFees / this.budget;
    }

    get netWinningsAfterFeesPercentString():string {
        return (this.netWinningsAfterFeesPercent * 100).toFixed(2) + "%";
    }

    get positionsString():string {
        return this.positions.map(position => position.toString()).join(", ");
    }

    get positionsCount():number {
        return this.positions.length;
    }
}