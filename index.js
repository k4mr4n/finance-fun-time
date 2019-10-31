const Utils = require('./utils/utils')
const { reduceData } = require('./utils/reduce')

async function main() {
  try {
    const InputData = await Utils.getFile('./input.txt')
    
    const reducedData = reduceData(InputData)
    
    await Utils.writeFile('output.json', reducedData)
    
    console.log('Data written to file')
  } catch(e) {
    console.error(e)
  }
}

main()