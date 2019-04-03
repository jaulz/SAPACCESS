var express = require("express")
var expRoute = express.Router()
const bodyParser = require("body-parser")
var SAP = require('./system/SAPconnect')
var rs = JSON.parse('{ "RETURN": [] }')

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

expRoute.get("/:RFCNAME", async function (req, res) {
  SAP().then(() => {
    req.body.USER.forEach(async (element, index, array) => {
      await client.invoke(req.params.RFCNAME, element, function (error, result) {
        if (error) {
          console.error("Error invoking " + req.params.RFCNAME + ": ", error)
          res.status(400).json({ status: 400, message: e.message })
        }
        rs["RETURN"].push({ "USER": result.RETURN[0].MESSAGE })
        console.log("Result: " + result.RETURN[0].MESSAGE)
        if (index === (array.length - 1)) {
          console.log('Done!')
          res.status(200).send(rs)
        }
      })
    })
  })
})

module.exports = expRoute