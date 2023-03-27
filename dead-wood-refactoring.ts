const namer = require("random-name");
const _ = require("lodash");

// Gets the USD value of the selected currency
function getSpotPrice(currency) {
    switch (currency) {
        case 'USDT':
        case 'USDC':
        case 'DAI':
        default:
            return 1
    }
}

// Picks a random deposit currency
function getCurrency() {
    const options = ["USDT", "USDC", "DAI"];
    const option = _.random(0, 2);
    return options[option];
}


// Rules
const timePeriods = 10;
const adjustCollateralMin = 1;
const adjustCollateralMax = 1000;
const oddsNewPositionIsProducer = 0;
const minNumNewPositionsPerPeriod = 1;
const maxNumNewPositionsPerPeriod = 1;
const startingReferencePriceMin = 100000000;
const startingReferencePriceMax = 5000000000;
const referencePriceMaxShiftDownPerPeriod = 0.006;
const referencePriceMaxShiftUpPerPeriod   = 0.005;
const oddsAddCollateral = 0.0;
const oddsRemoveCollateral = 1;
const exitFeeTraders = 0.003;
const exitFeeLPs = 0.001;
// TODO add support for MIMIC rewards and timelocks
// TODO add support for multiple currencies

// Tracking Parameters
let totalAmountLong    = 0;
let totalAmountShort   = 0;
let totalDepositsLong  = 0;
let totalDepositsShort = 0;
let totalFeesPaidLong  = 0;
let totalFeesPaidShort = 0;
let totalLpAssetsLong  = 0;
let totalLpAssetsShort = 0;            
let positions          = [];
let history            = [];

function trueOrFalse() {
    return (_.random(0, 1) === 1) ? true : false;
}

function adjustCollateralAmount() {
    return _.random(adjustCollateralMin, adjustCollateralMax);
}

function getReferencePrice(lastPrice) {
    if (lastPrice == undefined) {
        return _.random(startingReferencePriceMin, 
                        startingReferencePriceMax);
    } else {
        return lastPrice * _.random(1 - referencePriceMaxShiftDownPerPeriod, 
                                    1 + referencePriceMaxShiftUpPerPeriod);
    }
}

function createPosition() {
    // For each player we should track
    // -> How long they played the game
    const amount = adjustCollateralAmount();
    return {
        name:        namer(),
        currency:    getCurrency(),
        isLong:      trueOrFalse(),
        deposit:     amount,
        withdraw:    0,
        paperProfit: 0 - (amount * exitFeeTraders),
        realProfit:  0,
        earnsFees:   false,
        feesEarned:  0,
        feesPaid:    0,
        liquidationValue: amount - (amount * exitFeeTraders)
    };
}

function addPosition(position) {
    positions.push(Object.assign({}, position));
    
    // Increment the total pool size or LP pool size
    if (position.isLong === true) {
        if (position.earnsFees === true) {
            totalLpAssetsLong  += position.deposit;
        } else {
            totalAmountLong    += position.deposit;
        }
        totalDepositsLong  += position.deposit;
        
    } else {
        if (position.earnsFees === true) {
            totalLpAssetsShort += position.deposit;
        } else {
            totalAmountShort   += position.deposit;
        }
        totalDepositsShort += position.deposit;
    }
}

function deriveStats(info) {
    // For each simulation we should track
    // -> Number of players
    // -> Average position size
    // -> Total deposits
    // -> Total fees paid
    // -> Average earnings per LP per $1 of liquidity
    // -> Average profit/losses of LPs
    return {};
}

// Monte Carlo simulation
function monteCarlo(numSamples = timePeriods) {
    
    for (let i = 0; i < numSamples; i++) {
        // ALWAYS GET THE LATEST REFERENCE PRICE   
        let referencePrice = (i === 0)
            ? getReferencePrice()
            : getReferencePrice(history[i-1].referencePrice);
        
        if (i > 0) {
            // PERFORM VALUE TRANSFERS WHEN WE HAVE ENOUGH INFO
            if (totalAmountLong > 0 && totalAmountShort > 0) 
            {
                const diff = 1 - (referencePrice / history[i - 1].referencePrice);
                if (diff < 0) {
                    // shorts pay longs
                    totalAmountShort -= totalAmountShort * -diff
                    totalAmountLong  += totalAmountShort * -diff
                } else {
                    // longs pay shorts
                    totalAmountShort += totalAmountShort * diff
                    totalAmountLong  -= totalAmountShort * diff
                }
            }

            // CALCUALTE THE LP POSITION VALUES BEFORE ANY CHANGES
            // TODO - THIS MAY NEED TO MOVE TO THE END
            totalLpAssetsLong  = 0;
            totalLpAssetsShort = 0;
            for (let q = 0, l = positions.length; q < l; q++) {
                if (positions[q].earnsFees === true) {
                    const positionSize = positions[q].deposit - positions[q].withdraw;
                    if (positions[q].isLong === true) {
                        totalLpAssetsLong  += positionSize;
                    } else {
                        totalLpAssetsShort += positionSize;
                    }
                }
            }

            // ADJUST EXISTING POSITIONS
            let amount = 0;
            let newPositions = [];
            for (let e = 0, l = positions.length; e < l; e++) {
                // let newPosition = Object.assign({}, positions[e]);
                newPositions[e] = Object.assign({}, positions[e]);
                amount = adjustCollateralAmount();
                
                if (_.random(0, 1, true) <= oddsAddCollateral) {
                    // Increase the position size
                    newPositions[e].deposit += amount;

                    // Adjust our totals
                    if (newPositions[e].isLong === true) {
                        totalAmountLong    += amount;
                        totalDepositsLong  += amount;
                    } else {
                        totalAmountShort   += amount;
                        totalDepositsShort += amount;
                    }
                }
            
                if (_.random(0, 1, true) <= oddsRemoveCollateral) {
                    // Decrease position size
                    amount = adjustCollateralAmount();
                    amount = _.min([
                        amount, 
                        (
                            newPositions[e].deposit
                            - newPositions[e].withdraw
                            - newPositions[e].feesPaid
                        )
                    ]);
                    
                    // Pick the right exit fee, depending on LP or not
                    let exitFee = (newPositions[e].earnsFees === true) 
                        ? exitFeeLPs
                        : exitFeeTraders;
                    
                    const moneyOut = (newPositions[e].isLong === true) 
                        ? (amount / totalDepositsLong)  * totalAmountLong
                        : (amount / totalDepositsShort) * totalAmountShort;
                    const exitFeeToPay = moneyOut * exitFee;

                    if (newPositions[e].isLong === true) {
                        totalAmountLong    -= moneyOut;
                        totalDepositsLong  -= moneyOut;
                        totalFeesPaidLong  += exitFeeToPay;
                    } else {
                        totalAmountShort   -= moneyOut;
                        totalDepositsShort -= moneyOut;
                        totalFeesPaidShort += exitFeeToPay;
                    }

                    newPositions[e].withdraw += moneyOut - exitFeeToPay;
                    newPositions[e].feesPaid += exitFeeToPay;
                }

                // CALCULATE ACTUAL PROFITS
                newPositions[e].realProfit = ((newPositions[e].withdraw - newPositions[e].deposit) > 0)
                    ? newPositions[e].withdraw - newPositions[e].deposit
                    : 0;
                    
                // CALCULATE LIQUIDATION VALUE
                const poolAssetsOwnedBeforeWithdraws = (newPositions[e].isLong === true) 
                    ? (newPositions[e].deposit / totalDepositsLong)  * totalAmountLong
                    : (newPositions[e].deposit / totalDepositsShort) * totalAmountShort;
                newPositions[e].liquidationValue = 
                    ((poolAssetsOwnedBeforeWithdraws - newPositions[e].withdraw) >= 0) 
                    ? poolAssetsOwnedBeforeWithdraws - newPositions[e].withdraw - newPositions[e].feesPaid
                    : 0;

                // CALCULATE PAPER PROFITS
                // const moneyInPool = newPositions[e].deposit - newPositions[e].withdraw;
                // const liquidationValue = (newPositions[e].isLong === true) 
                //         ? (moneyInPool / totalAmountLong)  * totalAmountLong
                //         : (moneyInPool / totalAmountShort) * totalAmountShort;
                newPositions[e].paperProfit = (newPositions[e].liquidationValue === 0) 
                    ? 0
                    : newPositions[e].withdraw
                      + newPositions[e].liquidationValue
                      - newPositions[e].deposit;
            }

            // Replace the positions list
            positions = newPositions;

            // DISTRIBUTE EXIT FEES TO LPs
//             for (let f = 0, l = history[i - 1].positions.length; f < l; f++) {
//                 if (positions[f].earnsFees === true) {
//                     const activeLpAmount = positions[f].deposit - positions[f].withdraw
//                     const percentOfFees = (positions[f].isLong === true)
//                         ? activeLpAmount / totalLpAssetsLong
//                         : activeLpAmount / totalLpAssetsLong;

//                     positions[f].feesEarned = (positions[f].isLong === true)
//                         ? percentOfFees * (totalLpAssetsLong - history[i - 1].totalLpAssetsLong)
//                         : percentOfFees * (totalLpAssetsLong - history[i - 1].totalLpAssetsShort)
//                 }
//             }
        }
        
        
        // ADD NEW POSITIONS
        const numNewPositions = _.random(minNumNewPositionsPerPeriod, maxNumNewPositionsPerPeriod);
        for (let p = 0; p < numNewPositions; p++) {
            let positionA = createPosition();
            
            // If this is a two-sided position
            if (_.random(0, 1, true) <= oddsNewPositionIsProducer) {
                positionA.earnsFees = true;
                positionA.paperProfit = 0 - (positionA.deposit * exitFeeLPs)
                positionA.liquidationValue = positionA.deposit - (positionA.deposit * exitFeeLPs)
                let positionB = Object.assign({}, positionA);
                positionB.isLong  = !(positionA.isLong)
                positionB.deposit = adjustCollateralAmount();
                positionB.paperProfit = 0 - (positionB.deposit * exitFeeLPs)
                positionB.liquidationValue = positionB.deposit - (positionB.deposit * exitFeeLPs)
                addPosition(positionB);
            }
            addPosition(positionA);
        }
        
        // ALWAYS SAVE THIS SAMPLE INTO HISTORY
        let info = {
            period: i,
            totalAmountLong: totalAmountLong,
            totalAmountShort: totalAmountShort,
            totalFeesPaidLong: totalFeesPaidLong,
            totalFeesPaidShort: totalFeesPaidShort,
            totalLpAssetsLong: totalLpAssetsLong,
            totalLpAssetsShort: totalLpAssetsShort,
            referencePrice: referencePrice,
            positions: Object.assign({}, positions),
        };
        // info.stats = deriveStats(info);
        history.push(info);
    }
    
    // TODO - CLOSE ALL POSITIONS
}

monteCarlo();
console.log(history);