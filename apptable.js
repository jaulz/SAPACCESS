var express = require("express")
var expRoute = express.Router()
const bodyParser = require("body-parser")
const r3connect = require('r3connect')
const abapSys = require('./system/abapSys')

expRoute.use(
  bodyParser.urlencoded({
    extended: true
  })
)
expRoute.use(bodyParser.json())
expRoute.use(function timeLog(req, res, next) {
  console.log("SAPTABLE active time: ", Date.now())
  next()
})

expRoute.get("/", function (req, res) {
  r3connect.Pool.get(abapSys.development).acquire()
    .then(function (client) {
      //console.log('Client Version: ', client.getVersion())
      console.log('Are we connected?', client.ping())
      console.log('Connecting...')
      console.log('Invoke RFC_READ_TABLE...')
      return client.invoke("RFC_READ_TABLE", req.body)
    })
    .then(function (response) {
      var resultJson = dataToJson(response[0].FIELDS, response[0].DATA)
      res.status(200).send(resultJson)
      console.log("Result RFC_READ_TABLE:", resultJson)
    })
    .catch(function (error) {
      res.status(400).send(error)
      console.error("Error RFC_READ_TABLE:", error)
    })
})

function dataToJson(FIELDS, DATA) {
  var colCount
  var rowCount = Object.keys(DATA).length
  var result = ""
  var row = ""
  for (let i = 0; i < rowCount; i++) {
    var parts = DATA[i].WA.split("\t")
    row = "{"
    colCount = parts.length
    for (let j = 0; j < colCount; j++) {
      if (['C', 'D', 'T', 'N', 'STRING'].includes(FIELDS[j].TYPE)) {
        row = row + '"' + FIELDS[j].FIELDNAME + '": "' + parts[j].trim() + '",'
      } else {
        row = row + '"' + FIELDS[j].FIELDNAME + '": ' + parts[j].trim() + ","
      }
    }
    row = row.replace(/.$/, "}") //replase last char
    result = result + row + ",\n"
  }
  result = result.replace(/,([^,]*)$/, "$1") //delete last ","

  return JSON.parse("[" + result + "]")
}

module.exports = expRoute
