module.exports = app => {
    const controller = require("../controller/order.controller")
    const express = require('express');
    var router = express.Router()

    app.use("/api/orders", router)

    //GET
    router.get("/", controller.getAllOrders)
    router.get("/user", controller.getOrdersByUserId)

    //POST
    router.post("/create", controller.create)
    router.post("/update", controller.update)
    router.post("/delete", controller.delete)
}