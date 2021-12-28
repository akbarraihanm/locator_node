const { user } = require("../models");
const { Op } = require("sequelize");
const db = require("../models")
const Store = db.store;
const statusRes = require("../res.js")

exports.create = async function(req, res) {
    var name = req.body.name;
    var userId = req.body.userId;

    if (name == null) statusRes.badRequest("Store name must be filled", res)

    try {
        const store = await Store.findAll({
            where: {
                [Op.and]: [{name: name}, {userId: userId}]
            }
        })
        if (store.length > 0) statusRes.badRequest("You are already added this store", res)
        else {
            await Store.create({
                name: name,
                userId: userId
            })
            const storeAdded = await Store.findOne({
                where: {
                    name: name,
                    userId: userId
                }
            })
            statusRes.postOk(storeAdded, "Store has been added", res)
        }
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.getAll = async function(req, res) {
    var userId = req.query.userId;

    try {
        const stores = await Store.findAll({
            where: {userId: userId},
            include: {
                model: user,
                attributes: {
                    exclude: ['password']
                }
            }
        })
        statusRes.ok(stores, res)
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.delete = async function(req, res) {
    var id = req.body.id;
    
    try {
        const store = await Store.findOne({ 
            where: {id: id},
            attributes: { exclude: ['userId']},
            include: {
                model: user,
                attributes: {
                    exclude: ['password']
                }
            }
         })
        if (store === null) statusRes.notFound("Store not found", res);
        else {
            await Store.destroy({ where: { id: id } })
            statusRes.postOk(store, "Store has been deleted", res)
        }
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}