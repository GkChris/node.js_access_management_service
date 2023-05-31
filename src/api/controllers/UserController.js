const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');
const utils = require('../utils');

const statusCodes = JSONdata.StatusCodes;

const CodeGenerators = utils.CodeGenerators;
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

        const backendId = payload?.backendId ? payload.backendId : false;
        const roleId = payload?.roleId ? payload.roleId : false;
        const realmId = payload?.realmId ? payload.realmId : false;
        const clientId = payload?.clientId ? payload.clientId : false;
        let password = payload?.password ? payload.password : false;

        try {
            CommonValidations.is_content_missing({
                backendId,
                roleId,
                realmId,
                clientId
            });
            CommonValidations.mongoose_ObjectId_validation(backendId);
            CommonValidations.mongoose_ObjectId_validation(roleId);
            CommonValidations.mongoose_ObjectId_validation(realmId);
            CommonValidations.mongoose_ObjectId_validation(clientId);

            await UserService.find_user_references_or_reject(roleId, realmId, clientId)

            if ( password ) password = await UserService.hashPassword(password);
            const userId = CodeGenerators.uuid4_id();

            await UserService.createUser(
                backendId,
                userId,
                password,
                roleId,
                realmId,
                clientId
            );

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