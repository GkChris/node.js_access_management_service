const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');
const utils = require('../utils');

const statusCodes = JSONdata.StatusCodes;

const CommonServices = services.CommonServices;
const CommonValidations = validations.CommonValidations;

const AuthService = services.AuthService;
const ApiService = services.ApiService;

// Module routes
const routes = {
    fetchRequiredIds: '/fetch/required/ids',
}


router.route(routes.fetchRequiredIds)
    .get(async(req, res, next) => {

        const payload = req?.query;

        const realmName = payload?.realmName;
        const clientName= payload?.clientName
        const roleName = payload?.roleName;

        try {
            CommonValidations.is_content_missing({realmName, clientName, roleName});

            const { realmId, clientId, roleId } = await ApiService.fetchRequiredIds(realmName, clientName, roleName)

            var responseData = {realmId, clientId, roleId};

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({
            code: statusCodes.ok.code, 
            message: statusCodes.ok.msg,
            data: responseData,
        });
});



module.exports = router;