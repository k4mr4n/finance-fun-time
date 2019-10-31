const Utils = require('./utils')
const { reduceData } = require('./reduce')

describe('expect reduce data to be same as output', () => {
  test('should return expected output', async () => {
    const InputData = await Utils.getFile('./input.txt')
    const OutputData = await Utils.getFile('./output.txt')
    
    const reducedData = reduceData(InputData)
    
    expect(reducedData).toEqual(OutputData)
  })
})