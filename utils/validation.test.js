const { exceedTransactionLimit } = require('./validation')

describe('Validation', () => {
  test('should return -1 for duplicated load id', () => {
    const load_amount = '$1'
    const time = "2000-01-05T07:18:02Z"
    const arr = [{id: 2, load_amount, time }, {id: 1, load_amount, time }]
    const load = {id: 1, load_amount, time }
    const output = exceedTransactionLimit(arr, load)
    expect(output).toBe(-1)
  })
  
  test('should return -1 for duplicated load id', () => {
    const load_amount = '$1'
    const time = "2000-01-05T07:18:02Z"
    const arr = [{id: 1, load_amount, time }]
    const load = {id: 1, load_amount, time }
    const output = exceedTransactionLimit(arr, load)
    expect(output).toBe(-1)
  })
  
  test('should not crash on empty array of loads', () => {
    const load_amount = '$1'
    const time = "2000-01-05T07:18:02Z"
    const arr = []
    const load = {id: 1, load_amount, time }
    const output = exceedTransactionLimit(arr, load)
    expect(output).toBe(0)
  })
  
  test('should not crash on undefined load', () => {
    const arr = []
    const output = exceedTransactionLimit(arr)
    expect(output).toBe(0)
  })

  test('should return 1 for exceeded daily amount', () => {
    const time = "2000-01-05T07:18:02Z"
    const accepted = true
    const arr = [{id: 1, load_amount: '$5000', time, accepted }]
    const load = {id: 2, load_amount: '$1', time }
    const output = exceedTransactionLimit(arr, load)
    expect(output).toBe(1)
  })
  
  // a user attempting to load $3,000 twice in one day would be declined on the second attempt,
  test('should return 1 for exceeded daily amount', () => {
    const time = "2000-01-05T07:18:02Z"
    const accepted = true
    const arr = [{id: 1, load_amount: '$3000', time, accepted }]
    const load = {id: 2, load_amount: '$3000', time }
    const output = exceedTransactionLimit(arr, load)
    expect(output).toBe(1)
  })
  
  // a user attempting to load $400 four times in a day.
  test('should return 1 for exceeded daily transaction limit', () => {
    const time = "2000-01-05T07:18:02Z"
    const accepted = true
    const arr = [
      {id: 1, load_amount: '$400', time, accepted },
      {id: 2, load_amount: '$400', time, accepted },
      {id: 2, load_amount: '$400', time, accepted },
    ]
    const load = {id: 3, load_amount: '$400', time }
    const output = exceedTransactionLimit(arr, load)
    expect(output).toBe(1)
  })
  
  test('should return 1 for exceeded weekly transaction limit', () => {
    const accepted = true
    const arr = [
      {id: 1, load_amount: '$4500', time: "2019-10-28T07:18:02Z", accepted },
      {id: 2, load_amount: '$4500', time: "2019-10-29T07:18:02Z", accepted },
      {id: 2, load_amount: '$4500', time: "2019-10-30T07:18:02Z", accepted },
      {id: 2, load_amount: '$4500', time: "2019-10-31T07:18:02Z", accepted },
      {id: 2, load_amount: '$4500', time: "2019-11-01T07:18:02Z", accepted }
    ]
    const load = {id: 3, load_amount: '$4500', time: "2019-11-02T07:18:02Z" }
    const output = exceedTransactionLimit(arr, load)
    expect(output).toBe(1)
  })
  
  test('should return 0 for not exceeding weekly transaction limit', () => {
    const accepted = true
    const arr = [
      {id: 1, load_amount: '$4500', time: "2019-10-28T07:18:02Z", accepted },
      {id: 2, load_amount: '$4500', time: "2019-10-29T07:18:02Z", accepted },
      {id: 2, load_amount: '$4500', time: "2019-10-30T07:18:02Z", accepted },
      {id: 2, load_amount: '$4500', time: "2019-10-31T07:18:02Z", accepted }
    ]
    const load = {id: 3, load_amount: '$4500', time: "2019-11-02T07:18:02Z" }
    const output = exceedTransactionLimit(arr, load)
    expect(output).toBe(1)
  })
})