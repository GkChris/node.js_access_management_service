const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonSerivces = services.CommonSerivces;
const CommonValidations = validations.CommonValidations;

const UserService = services.UserService;


// Module routes
const routes = {
    createUser: '/createUser$',
    // updateUser: '/updateUser$',
    // deleteUser: '/deleteUser$',
}

router.route(routes.createUser)
    .post(async(req, res, next) => {

        const payload = req.body?.data ? req.body.data : {};
        
        const password = payload?.password ? payload.password : false;
        const roleId = payload?.roleId ? payload.roleId : false;
        const realmId = payload?.realmId ? payload.realmId : false;
        const clientId = payload?.clientId ? payload.clientId : false;

        try {
            CommonValidations.mongoose_ObjectId_validation(roleId);
            CommonValidations.mongoose_ObjectId_validation(realmId);
            CommonValidations.mongoose_ObjectId_validation(clientId);
            CommonValidations.is_content_missing({
                password,
                roleId,
                realmId,
                clientId
            });

            await UserService.find_user_references_or_reject(roleId, realmId, clientId)

            await UserService.createUser({
                password,
                roleId,
                realmId,
                clientId
            });

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({code: statusCodes.created.code, message: statusCodes.created.msg});
});


// router.route(routes.updateUser)
//     .post(async(req, res, next) => {

//         const randomArgument = req.query?.randomArgument ? req.query.randomArgument : false;

//         try {
//             CommonValidations.is_content_valid(req.query);
//             CommonValidations.is_content_missing({randomArgument});

//             await UserService.get_success();
//         } catch ( error ) {
//             return next(error);
//         }

//         res.locals.message = statusCodes.ok.msg;
//         return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
// });


// router.route(routes.deleteUser)
//     .get(async(req, res, next) => {

//         const randomArgument = req.query?.randomArgument ? req.query.randomArgument : false;

//         try {
//             CommonValidations.is_content_valid(req.query);
//             CommonValidations.is_content_missing({randomArgument});

//             await UserService.get_error()
//         } catch ( error ) {
//             return next(error)
//         }   

//         res.locals.message = statusCodes.ok.msg;
//         return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg})
// });


module.exports = router;