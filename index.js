const { promisify } = require('util')
const fs = require('fs')

const readFileAsync = promisify(fs.readFile)

async function asyncReadFile(fileName) {
  let text = await readFileAsync(fileName, 'utf-8')
  let array = text.split('\n')

  for(let i = 0; i < array.length; i++) {
    array[i] = array[i].replace('\r', '')
  }

  return array
}

function writeArrayToFile(array) {
  for(let i = 0; i < array.length; i++) {
    if(i !== (array.length - 1) && !array[i].includes('\n')) array[i] = `${array[i]}\n`
  }

  fs.writeFileSync('Horarios.txt', array.join(''), 'utf-8')
}

function getDiffTime(oldDate, newDate) {
    let seconds = Math.round((newDate - oldDate) / 1000)
    let minutes = seconds / 60
    let hours = minutes / 60
    
    hours = Math.floor(hours)
    minutes = Math.floor(minutes)

    minutes = minutes % 60

    hours = hours.toString()
    minutes = minutes.toString()

    if(minutes.length === 1) minutes = `0${minutes}`
    if(hours.length === 1) hours = `0${hours}`

    return {
      hours: hours,
      minutes: minutes
    }
}

function getBrazilDate(date) {
  let timezoneOffset = date.getTimezoneOffset()

  if(timezoneOffset === 120)
    date.setHours(date.getHours() - 1)

  return date
}

function getLocaleDate(date) {
  let yyyy = date.getFullYear()
  let mm = (date.getMonth() + 1).toString()
  let dd = date.getDate().toString()

  if(mm.length === 1) mm = `0${mm}`
  if(dd.length === 1) dd = `0${dd}`

  return `${dd}/${mm}/${yyyy}`
}

async function main() {
  let array = await asyncReadFile('Horarios.txt')

  let initDate = getBrazilDate(new Date())

  let today = getLocaleDate(initDate)
  let initTime = initDate.toLocaleTimeString()

  array.push(`${today} | ${initTime} | ${initTime} | 00:00`)

  writeArrayToFile(array)

  let lastIndex = array.length - 1

  setInterval(() => {

    let actualJsDate = getBrazilDate(new Date())
    let actualTime = actualJsDate.toLocaleTimeString()

    let {hours, minutes} = getDiffTime(initDate, actualJsDate)

    array[lastIndex] = `${today} | ${initTime} | ${actualTime} | ${hours}:${minutes}`
    writeArrayToFile(array)

  }, 60000)
}

main()