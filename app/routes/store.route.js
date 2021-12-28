module.exports = app => {
    const controller = require("../controller/store.controller")
    const express = require('express');
    var router = express.Router()

    app.use("/api/stores", router)

    //GET
    router.get("/", controller.getAll);

    //POST
    router.post("/create", controller.create)
    router.post("/delete", controller.delete)
}