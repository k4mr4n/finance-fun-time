const fs = require('fs')
const moment = require('moment')
const readline = require('readline')

moment.updateLocale('en', {
  week: {
    dow: 1, // set start of week to monday
  },
})

const getIsTheSameWeek = (t1, t2) => moment(t1).utc().isSame(t2, 'week')

const parseLoadAmount = amount => parseFloat(amount.slice(1))

const formatTime = (time, format = 'YYYY-MM-DD') => moment(time).utc().format(format)

const getFile = (filePath) => {
  // create instance of readline
  // each instance is associated with single input stream
  let rl = readline.createInterface({
    input: fs.createReadStream(filePath)
  })

  return new Promise((resolve, reject) => {
    let output = []
    // event is emitted after each line
    rl.on('line', function(line) {
      output.push(line)
    });

    // end
    rl.on('close', function(line) {
      try {
        const data = JSON.parse(`[${output.join(',')}]`)
        resolve(data)
      } catch (error) {
        console.error('failed parsing input', error)
        reject(error)
      }
    });
  })
}

const writeFile = (fileName, data) => {
  const json = JSON.stringify(data, null, 2);

  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, json, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

module.exports = {
  getFile,
  writeFile,
  formatTime,
  parseLoadAmount,
  getIsTheSameWeek
}