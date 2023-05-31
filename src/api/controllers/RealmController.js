const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonSerivces = services.CommonSerivces;
const CommonValidations = validations.CommonValidations;

const RealmService = services.RealmService;


// Module routes
const routes = {
    createRealm: '/createRealm$',
}

router.route(routes.createRealm)
    .post(async(req, res, next) => {

        const name = req.body?.data?.name ? req.body.data.name : false;

        try {
            CommonValidations.is_content_missing({name});

            await RealmService.createRealm(name);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({code: statusCodes.created.code, message: statusCodes.created.msg});
});


module.exports = router;