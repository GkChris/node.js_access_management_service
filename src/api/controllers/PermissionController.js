const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonServices = services.CommonServices;
const CommonValidations = validations.CommonValidations;

const PermissionService = services.PermissionService;


// Module routes
const routes = {
    createPermission: '/createPermission$',
}

router.route(routes.createPermission)
    .post(async(req, res, next) => {

        const name = req.body?.data?.name ? req.body.data.name : false;
        const code = req.body?.data?.code ? req.body.data.code : false;
        const description = req.body?.data?.description ? req.body.data.description : false;

        try {
            CommonValidations.is_content_missing({name, code});

            await PermissionService.createPermission(name, code, description);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({code: statusCodes.created.code, message: statusCodes.created.msg});
});


module.exports = router;