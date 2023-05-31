const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonSerivces = services.CommonSerivces;
const CommonValidations = validations.CommonValidations;

const RoleService = services.RoleService;


// Module routes
const routes = {
    createRole: '/createRole$',
}

router.route(routes.createRole)
    .post(async(req, res, next) => {

        const name = req.body?.data?.name ? req.body.data.name : false;
        const realmId = req.body?.data?.realmId ? req.body.data.realmId : false;
        const permissions = req.body?.data?.permissions ? req.body.data.permissions : false;

        try {
            CommonValidations.is_content_missing({name, realmId});
            CommonValidations.mongoose_ObjectId_validation(realmId);

            await RoleService.find_role_references_or_reject(realmId)

            await RoleService.createRole(name, realmId, permissions);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({code: statusCodes.created.code, message: statusCodes.created.msg});
});


module.exports = router;