'use strict'

exports.ok = function(values, res) {
    var data = {
        'status' : true,
        'message': "Get data success",
        'data' : values
    };

    res.json(data);
    res.end();
};

exports.postOk = function(values, message, res) {
    var data = {
        'status' : true,
        'message' : message,
        'data' : values
    };

    res.json(data);
    res.end();
}

exports.badRequest = function (message, res) {
    var data = {
        'status' : false,
        'message' : message,
        'data': null
    }

    res.status(400).json(data);
    res.end();
}

exports.unauthorized = function(res) {
    var data = {
        'status' : false,
        'message' : "Unauthorized"
    }
    res.status(401).json(data);
    res.end();
}

exports.forbidden = function(res) {
    var data = {
        'status' : false,
        'message' : "Forbidden"
    }
    res.status(403).json(data);
    res.end();
}

exports.notFound = function(message, res) {
    var data = {
        'status' : false,
        'message' : message,
        'data': null
    };
    
    res.status(404).json(data);
    res.end();
}

exports.internalServerError = function(message, res) {
    var data = {
        'status' : false,
        'message' : message
    };

    res.status(500).json(data);
    res.end();
}