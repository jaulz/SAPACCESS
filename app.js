var express = require("express")
var app = express()
var apptable = require("./apptable")
var apprfc = require("./apprfc")
var appuser = require("./appUser")
var appQuery = require("./appQuery")
require("./system/cmdColor")

global.client

app.use("/SAPTABLE", apptable)
app.use("/SAPRFC", apprfc)
app.use("/SAPUSER", appuser)
app.use("/SAPQUERY", appQuery)

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send("Something broke!" + err)
})

app.listen(3310, function () {
  console.log('Live at Port 3310')
})