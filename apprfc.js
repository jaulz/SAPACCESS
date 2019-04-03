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
  console.log("Route RFC active time: ", Date.now())
  next()
})

expRoute.get("/:RFCNAME", function (req, res) {
  r3connect.Pool.get(abapSys.production).acquire()
    .then(function (client) {
      //console.log('Client Version: ', client.getVersion())
      console.log('Are we connected?', client.ping())
      console.log('Connecting...')
      console.log('Invoke ', req.params.RFCNAME)
      return client.invoke(req.params.RFCNAME, req.body)
    })
    .then(function (response) {
      res.status(200).send(response)
      console.log("Result " + req.params.RFCNAME + ":", response)
    })
    .catch(function (error) {
      res.status(400).send(error)
      console.error("Error invoking " + req.params.RFCNAME + ": ", error)
    })
})

module.exports = expRoute
