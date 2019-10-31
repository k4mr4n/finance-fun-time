const Validation = require('./validation')

const reduceData = data => data.reduce((acc, load) => {
  let accepted = true
  const sameUser = acc.filter(l => l.customer_id === load.customer_id)
  const exceeded = Validation.exceedTransactionLimit(sameUser, load)

  // ignore any duplicate loads for the same user
  if (exceeded === -1) {
    return acc
  }

  if (exceeded === 1) {
    accepted = false
  }

  return [
    ...acc,
    {
      ...load,
      accepted
    }
  ]
}, []).map(({ id, customer_id, accepted }) => ({
  id,
  customer_id,
  accepted
}))

module.exports = {
  reduceData
}