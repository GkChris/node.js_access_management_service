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

const RealmService = services.RealmService;


// Module routes
const routes = {
    create: '/create',
    update: '/update/:id',
    delete: '/delete/:id',
    deleteMultiple: '/deleteMultiple',
    fetch: '/fetch/:id?',
}

router.route(routes.create)
    .post(async(req, res, next) => {

        const payload = req.body?.data;

        const name = payload?.name;
        const description = payload?.description;

        try {
            CommonValidations.is_content_missing({name});

            await RealmService.createRealm({name, description});

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({code: statusCodes.created.code, message: statusCodes.created.msg});
});



router.route(routes.update)
    .post(async(req, res, next) => {

        const id = req.params?.id;

        const payload = req.body?.data;

        try {
            CommonValidations.is_content_missing({id, payload});
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            await RealmService.updateRealm(id, payload);

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

            await RealmService.deleteRealm(id);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



router.route(routes.deleteMultiple)
    .post(async(req, res, next) => {

        const ids = req.body?.data?.ids;

        try {
            CommonValidations.is_content_missing({ids});
            ids.forEach(id => {
                CommonValidations.mongoose_ObjectId_validation(id) 
            });

            await RealmService.deleteRealms(ids);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


router.route(routes.fetch)
    .get(async(req, res, next) => {

        const id = req.params?.id;
        
        const payload = req.query;
        
        const fields = payload?.fields ? req.query.fields.split(',') : undefined;
        const limit = payload?.limit;
        const offset = payload?.offset;
        let filters = payload?.filters; // {name: "staging"}

        if ( filters ) try { filters = JSON.parse(req.query.filters) } catch ( error ) { filters = undefined };

        let realms;
        let query;

        try {

            const options = {
                fields,
                limit, 
                offset,
            }
            
            if ( id ) query = { _id: id };
            else query = {};

            if ( filters && utils.isPlainObject(filters) ) query = CommonServices.appendFiltersToQuery(query, filters);
            
            realms = await RealmService.fetchRealms(query, options);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({
            code: statusCodes.ok.code, 
            message: statusCodes.ok.msg,
            data: {realms}
        });
});


module.exports = router;