const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonServices = services.CommonServices;
const CommonValidations = validations.CommonValidations;

const RoleService = services.RoleService;


// Module routes
const routes = {
    createRole: '/createRole$',
}

router.route(routes.createRole)
    .post(async(req, res, next) => {

        const name = req.body?.data?.hasOwnProperty('name') ? req.body.data.name : false;
        const description = req.body?.data?.hasOwnProperty('description') ? req.body.data.description : false;
        const realmId = req.body?.data?.hasOwnProperty('realmId') ? req.body.data.realmId : false;
        const clientId = req.body?.data?.hasOwnProperty('clientId') ? req.body.data.clientId : false;
        const permissions = req.body?.data?.hasOwnProperty('permissions') ? req.body.data.permissions : false;

        try {
            CommonValidations.is_content_missing({name, realmId, clientId});
            CommonValidations.mongoose_ObjectId_validation(realmId);

            await CommonServices.find_required_references_byId_or_reject([  // {Model: _id}
                {'Realm': realmId},
                {'Client': clientId}
            ])

            await RoleService.createRole({name, description, realmId, clientId, permissions});

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({code: statusCodes.created.code, message: statusCodes.created.msg});
});


module.exports = router;