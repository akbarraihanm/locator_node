const { store, user } = require("../models");
const db = require("../models")
const Order = db.order
const statusRes = require("../res.js");

exports.getAllOrders = async function(req, res) {
    try {
        const list = await Order.findAll()
        statusRes.ok(list, res)
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.getOrdersByUserId = async function(req, res) {
    var userId = req.query.userId
    var storeId = req.query.storeId
    try {
        const checkStore = await store.findOne({where: {id: storeId}})
        if (checkStore === null) statusRes.notFound("Store and orders not found", res)
        else {
            const list = await Order.findAll({
                where: {
                    userId: userId,
                    storeId: storeId
                },
                attributes: { exclude: ['userId', 'storeId'] },
                include: [
                    {
                        model: user,
                        attributes: { exclude: ['password'] }
                    },
                    { model: store },
                ]                
            })
            statusRes.ok(list, res)
        }
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.create = async function(req, res) {
    var name = req.body.name
    var quantity = req.body.quantity
    var userId = req.body.userId
    var storeId = req.body.storeId

    if (name === null) statusRes.badRequest("Order name must be filled", res)
    if (quantity == null) statusRes.badRequest("Quantity must be filled", res)

    try {
        var map = {
            name: name,
            quantity: quantity,
            storeId: storeId,
            userId: userId
        }
        const created = await Order.create(map)
        const order = await Order.findOne({
            where: { id: created.id },
            attributes: { exclude: ['userId', 'storeId'] },
            include: [
                {
                    model: user,
                    attributes: { exclude: ['password'] }
                },
                { model: store },
            ]
        })
        statusRes.postOk(order, "Order has been created", res)
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.update = async function(req, res) {
    var name = req.body.name
    var quantity = req.body.quantity
    var id = req.body.id

    try {
        const order = await Order.findOne({where: {id: id}})
        if (order !== null) {
            var map = {
                name: name ?? order.name,
                quantity: quantity ?? order.quantity,
                storeId: order.storeId,
                userId: order.userId
            }
            await Order.update(map, {where: {id: id}})
            const returned = await Order.findOne({where: {id: id}})
            statusRes.postOk(returned, "Order has been updated", res)
        } else {
            statusRes.notFound("Order not found", res)
        }
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.delete = async function(req, res) {
    var id = req.body.id

    try {
        const order = await Order.findOne({where: {id: id}})
        if (order) {
            await Order.destroy({where: {id: id}})
            statusRes.postOk(order, "Order has been deleted", res)
        } else {
            statusRes.notFound("Order not found", res)
        }
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}