// Oracle
export const oracleMaxBearShiftPerPeriod: number = 0.005;    // 0 to 1, 0 is no movement, 1 is 100% movement
export const oracleMaxBullShiftPerPeriod: number = 0.005;    // 0 to 1, 0 is no movement, 1 is 100% movement
export const oraclePriceMin: number = 100000000;             // 100 million
export const oraclePriceMax: number = 5000000000;            // 5 billion

// Position
export const exitFeeTraders: number = 0.003;                 // 0 to 1, 0 is no fee, 1 is 100% fee
export const exitFeeLPs: number = 0.001;                     // 0 to 1, 0 is no fee, 1 is 100% fee

// Market
export const percentageOfMarketFeesToDirector: number = 0.15; // 0 to 1, 0 is no fees, 1 is 100% fees

// Simulation
export const oddsAddCollateral = 0.1;
export const oddsRemoveCollateral = 0.1;
export const oddsNewPositionIsLp: number = 0.1;              // 0 to 1, 0 is no LPs, 1 is all LPs
export const longShortDistanceThresholdForLp: number  = 0.9; // 0 to 1, 0 is no distance, 1 is 100% distance

// Unsorted
export const timePeriods = 10;
export const adjustCollateralMin = 1;
export const adjustCollateralMax = 1000;
// export const oddsNewPositionIsProducer = 0.01;
export const minNumNewPositionsPerPeriod = 1;
export const maxNumNewPositionsPerPeriod = 1;
export const referencePriceMaxShiftDownPerPeriod = 0.006;
export const referencePriceMaxShiftUpPerPeriod   = 0.005;
