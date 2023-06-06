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
    create: '/create',
    update: '/update',
    delete: '/delete/:id',
    deleteMultiple: '/deleteMultiple',
}

router.route(routes.create)
    .post(async(req, res, next) => {

        const payload = req.body?.data ? req.body.data : {};

        const username = payload?.hasOwnProperty('username') ? payload.username : undefined;
        const firstname = payload?.hasOwnProperty('firstname') ? payload.firstname : undefined;
        const lastname = payload?.hasOwnProperty('lastname') ? payload.lastname : undefined;
        const email = payload?.hasOwnProperty('email') ? payload.email : undefined;
        const phone = payload?.hasOwnProperty('phone') ? payload.phone : undefined;
        const phone_code = payload?.hasOwnProperty('phone_code') ? payload.phone_code : undefined;
        const roleId = payload?.hasOwnProperty('roleId') ? payload.roleId : undefined;
        const realmId = payload?.hasOwnProperty('realmId') ? payload.realmId : undefined;
        const clientId = payload?.hasOwnProperty('clientId') ? payload.clientId : undefined;
        let password = payload?.hasOwnProperty('password') ? payload.password : undefined;

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

            if ( password ) password = await utils.hashPassword(password);
            const sub = CodeGenerators.uuid4_id();

            await UserService.createUser({
                sub,
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




router.route(routes.update)
    .post(async(req, res, next) => {

        const id = req.body?.data?.hasOwnProperty('id') ? req.body.data.id : undefined;
        const payload = req.body?.data?.hasOwnProperty('payload') ? req.body.data.payload : undefined;

        try {
            CommonValidations.is_content_missing({id, payload});
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 


            // Find if payload contain data that should be checked for existing references
            let requiredReferences = [];
            if ( payload.roleId ) requiredReferences.push({'Role': payload.roleId});
            if ( payload.realmId ) requiredReferences.push({'Role': payload.realmId});
            if ( payload.clientId ) requiredReferences.push({'Role': payload.clientId});
            if ( requiredReferences.length > 0 ) await CommonServices.find_required_references_byId_or_reject(requiredReferences);


            if ( payload.password ) payload.password = await utils.hashPassword(password);
            await UserService.updateUser(id, payload);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


router.route(routes.delete)
    .post(async(req, res, next) => {

        const id = req.params?.id;

        try {
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            await UserService.deleteUser(id);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



router.route(routes.deleteMultiple)
    .post(async(req, res, next) => {

        const ids = req.body?.data?.hasOwnProperty('ids') ? req.body.data.ids : undefined;

        try {
            CommonValidations.is_content_missing({ids});
            ids.forEach(id => {
                CommonValidations.mongoose_ObjectId_validation(id) 
            });

            await UserService.deleteUsers(ids);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



module.exports = router;