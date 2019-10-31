const Utils = require('./utils')

const DAILY_PRICE_LIMIT = 5000
const DAILY_TRANSACTION_LIMIT = 3
const WEEKLY_PRICE_LIMIT = 20000

/**
 * @param {Array} arr Array of already reduced loads for the same user.
 * @param {Object} load current load which will be compared to previous loads.
 * @return {Number}
 * Return -1 if load already exists.
 * Return 0 if load did not exceeds limit.
 * Return 1 if load exceeds limit.
 */
const exceedTransactionLimit = (arr, load) => {
  if (!load) {
    return 0
  }
  const loadTime = Utils.formatTime(load.time)
  let dailyTransactionCount = 0
  let totalDailyAmount = Utils.parseLoadAmount(load.load_amount)
  let totalWeeklyAmount = Utils.parseLoadAmount(load.load_amount)
  
  // A maximum of DAILY_PRICE_LIMIT can be loaded per day
  if (totalDailyAmount > DAILY_PRICE_LIMIT) {
    return 1
  }
  
  // A maximum of WEEKLY_PRICE_LIMIT can be loaded per week
  if (totalWeeklyAmount > WEEKLY_PRICE_LIMIT) {
    return 1
  }
  
  for (let index = 0; index < arr.length; index++) {
    const _l = arr[index]

    const isTheSameDay = _l.time.indexOf(loadTime) === 0
    const isTheSameWeek = Utils.getIsTheSameWeek(_l.time, load.time)
    
    // finding duplicate loads
    if (_l.id === load.id) {
      return -1
    }

    if (!_l.accepted) {
      continue;
    }

    if (isTheSameDay) {
      dailyTransactionCount += 1
      totalDailyAmount += Utils.parseLoadAmount(_l.load_amount)
    }

    if (isTheSameWeek) {
      totalWeeklyAmount += Utils.parseLoadAmount(_l.load_amount)
    }
    
    // A maximum of DAILY_TRANSACTION_LIMIT loads can be performed per day, regardless of amount
    if (dailyTransactionCount >= DAILY_TRANSACTION_LIMIT) {
      return 1
    }

    // A maximum of DAILY_PRICE_LIMIT can be loaded per day
    if (totalDailyAmount > DAILY_PRICE_LIMIT) {
      return 1
    }

    // A maximum of WEEKLY_PRICE_LIMIT can be loaded per week
    if (totalWeeklyAmount > WEEKLY_PRICE_LIMIT) {
      return 1
    }
  }
  return 0
}

module.exports = {
  exceedTransactionLimit
}