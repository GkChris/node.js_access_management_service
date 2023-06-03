const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonServices = services.CommonServices;
const CommonValidations = validations.CommonValidations;

const SessionService = services.SessionService;
const UserService = services.UserService;

// Module routes
const routes = {
    createSession: '/createSession$',
}

router.route(routes.createSession)
    .post(async(req, res, next) => {

        const userId = req.body?.data?.userId ? req.body.data.userId : false;
        const realmId = req.body?.data?.realmId ? req.body.data.realmId : false;
        const clientId = req.body?.data?.clientId ? req.body.data.clientId : false;

        try {
            CommonValidations.is_content_missing({userId, realmId, clientId});
            CommonValidations.mongoose_ObjectId_validation(userId);
            CommonValidations.mongoose_ObjectId_validation(realmId);
            CommonValidations.mongoose_ObjectId_validation(clientId);

            await CommonServices.find_required_references_byId_or_reject([  // {Model: _id}
                {'User': userId},
                {'Realm': realmId},
                {'Client': clientId}
            ])

            const user = await UserService.getUserById(userId);     // Does not include user's password
            const token = SessionService.generateJwtToken(user);

            var session = await SessionService.createSession({userId, realmId, clientId, token});

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({
            code: statusCodes.created.code, 
            message: statusCodes.created.msg,
            data: {token: session.token}
        });
});


module.exports = router;