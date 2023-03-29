// Oracle
export const oracleMaxBearShiftPerPeriod = 0.005;   // 0 to 1, 0 is no movement, 1 is 100% movement
export const oracleMaxBullShiftPerPeriod = 0.005;   // 0 to 1, 0 is no movement, 1 is 100% movement
export const oraclePriceMin = 100000000;            // 100 million
export const oraclePriceMax = 5000000000;           // 5 billion

// Position
export const exitFeeTraders = 0.003;                // 0 to 1, 0 is no fee, 1 is 100% fee
export const exitFeeLPs = 0.001;                    // 0 to 1, 0 is no fee, 1 is 100% fee
export const oddsNewPositionIsLp = 0.1;             // 0 to 1, 0 is no LPs, 1 is all LPs

// Global
export enum Token {
    USDC = "USDC",
    USDT = "USDT",
    DAI = "DAI",
}

// Unsorted
export const timePeriods = 10;
export const adjustCollateralMin = 1;
export const adjustCollateralMax = 1000;
export const oddsNewPositionIsProducer = 0.01;
export const minNumNewPositionsPerPeriod = 1;
export const maxNumNewPositionsPerPeriod = 1;
export const referencePriceMaxShiftDownPerPeriod = 0.006;
export const referencePriceMaxShiftUpPerPeriod   = 0.005;
export const oddsAddCollateral = 0.01;
export const oddsRemoveCollateral = 0.99;
