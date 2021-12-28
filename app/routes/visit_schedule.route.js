module.exports = app => {
    const controller = require("../controller/visit_schedule.controller")
    const express = require('express');
    var router = express.Router()

    app.use("/api/schedules", router)

    //GET
    router.get('/', controller.get)

    //POST
    router.post('/create', controller.create)
    router.post('/update', controller.update)
}