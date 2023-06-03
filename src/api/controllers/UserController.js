const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');
const utils = require('../utils');

const statusCodes = JSONdata.StatusCodes;

const CodeGenerators = utils.CodeGenerators;
const CommonServices = services.CommonServices;
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

        const username = payload?.username ? payload.username : false;
        const firstname = payload?.firstname ? payload.firstname : false;
        const lastname = payload?.lastname ? payload.lastname : false;
        const email = payload?.email ? payload.email : false;
        const phone = payload?.phone ? payload.phone : false;
        const phone_code = payload?.phone_code ? payload.phone_code : false;
        const roleId = payload?.roleId ? payload.roleId : false;
        const realmId = payload?.realmId ? payload.realmId : false;
        const clientId = payload?.clientId ? payload.clientId : false;
        let password = payload?.password ? payload.password : false;

        try {
            CommonValidations.is_content_missing({
                roleId,
                realmId,
                clientId
            });
            CommonValidations.mongoose_ObjectId_validation(roleId);
            CommonValidations.mongoose_ObjectId_validation(realmId);
            CommonValidations.mongoose_ObjectId_validation(clientId);
           
            await CommonServices.find_required_references_byId_or_reject([  // {Model: _id}
                {'Role': roleId},
                {'Realm': realmId},
                {'Client': clientId}
            ])

            if ( password ) password = await UserService.hashPassword(password);
            const uuid4 = CodeGenerators.uuid4_id();

            await UserService.createUser({
                uuid4,
                password,
                username,
                firstname,
                lastname,
                email, 
                phone,
                phone_code,
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