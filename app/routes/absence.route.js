module.exports = app => {
    const controller = require("../controller/absence.controller")
    const express = require('express')
    const path = require('path')
    var router = express.Router()

    app.use('/api/absences', router)
    app.use("/files/absence", express.static(path.join(__dirname, '../../public/files/absence')))

    //GET
    router.get('/', controller.get)

    //POST
    router.post('/create', controller.create[0], controller.create[1], controller.create[2])
    router.post('/delete', controller.delete);
}