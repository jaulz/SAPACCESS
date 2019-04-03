var express = require("express")
var expRoute = express.Router()
const bodyParser = require("body-parser")
//var SAP = require('./SAPconnect')
const r3connect = require('r3connect')
const abapSys = require('./system/abapSys')

expRoute.use(
    bodyParser.urlencoded({
        extended: true
    })
);
expRoute.use(bodyParser.json())

expRoute.use(function timeLog(req, res, next) {
    console.log("Route RFC active time: ", Date.now())
    next()
})

// First we invoke the RSAQ_REMOTE_QUERY_CALL with the given parameters.If we call via RFC we want DATA_TO_MEMORY = ‘X’ otherwise output tables(LDATA) are not filled.For EXTERNAL_PRESENTATION you may choose out of below values.I test the ‘Z’ only.
// ‘S’ convert except for dates
// ‘X’ convert
// ‘E’ convert curr
// ‘Z’ convert curr except for dates

//****** search for invokeTimeout: 600 is default to 30
expRoute.get("/", function (req, res) {
    r3connect.Pool.get(abapSys.production).acquire()
        .then(function (client) {
            //console.log('Client Version: ', client.getVersion())
            console.log('Are we connected?', client.ping())
            console.log('Connecting...')
            console.log('Invoking RSAQ_REMOTE_QUERY_CALL')
            return client.invoke('RSAQ_REMOTE_QUERY_CALL', req.body)
        }).then(function (response) {
            //var response = require("./testdata")
            var rs = JSON.parse('{ "RETURN": [] }')
            var dataset = ''
            console.log('DATA: ', response[0])
            response[0].LDATA.forEach(line => dataset = dataset.concat(line.LINE));
            var lines = dataset.split(';')
            for (let i = 0; i < lines.length - 1; i++) {
                var record = {}
                var line = lines[i].split(',')
                for (let j = 0; j < response[0].LISTDESC.length; j++) {
                    var value = line[j].substring(line[j].indexOf(':') + 1)
                    if (response[0].LISTDESC[j].FTYP != 'C')
                        value = parseFloat(value)
                    record[response[0].LISTDESC[j].FDESC] = value
                }
                rs['RETURN'].push(record)
            }
            console.log('Result: ', rs)
            res.status(200).send(rs)
        })
        .catch(function (error) {
            res.status(400).send(error)
            console.error('Error: ', error)
        })
})

module.exports = expRoute