var rfc = require("node-rfc")

const abapSystem = {
    development: {
        user: "srw5",
        passwd: "analyst6",
        ashost: "10.11.9.22",
        sysnr: "00",
        client: "500",
        lang: "EN"
    },
    test: {
        user: "srwmisr",
        passwd: "analyst1",
        ashost: "10.11.9.11",
        sysnr: "00",
        client: "500",
        lang: "EN"
    },
    production: {
        user: "srwmisr",
        passwd: "analyst1",
        ashost: "10.11.9.11",
        sysnr: "00",
        client: "500",
        lang: "EN"
    }
}

module.exports = () => {
    return new Promise((resolve, reject) => {
        //if (typeof client == "undefined")
            client = new rfc.Client(abapSystem.production)

        if (client.ping() == false) {
            console.log('Client Version: ', client.getVersion())
            console.log('Are we connected?', client.ping())
            console.log('Connecting...')
            client.connect(function (err) {
                if (err) {
                    reject(err)
                } else {
                    console.log("SAP CONNECT:", abapSystem.production)
                    resolve('Connected!')
                }
            })
        } else
            resolve('Connected!')
    })
}