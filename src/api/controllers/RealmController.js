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

        const name = req.body?.data?.hasOwnProperty('name') ? req.body.data.name : undefined;
        const description = req.body?.data?.hasOwnProperty('description') ? req.body.data.description : undefined;

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
        const payload = req.body?.data?.hasOwnProperty('payload') ? req.body.data.payload : undefined;

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

        const ids = req.body?.data?.hasOwnProperty('ids') ? req.body.data.ids : undefined;

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
        
        let fields = req.query.hasOwnProperty('fields') ? req.query.fields.split(',') : undefined;
        let limit = req.query.hasOwnProperty('limit') ? req.query.limit : undefined;
        let offset = req.query.hasOwnProperty('offset') ? req.query.offset : undefined;
        let filters = req.query.hasOwnProperty('filters') ? req.query.filters : undefined; // {name: "staing"}

        if ( filters ) try { filters = JSON.parse(req.query.filters) } catch ( error ) { filters = undefined };

        let data;
        let query;

        try {

            let options = {
                fields,
                limit, 
                offset,
            }
            
            if ( id ) data = query = { _id: id };
            else data = query = {};

            if ( filters && utils.isPlainObject(filters) ) query = CommonServices.appendFiltersToQuery(query, filters);
            
            data = await RealmService.fetchRealms(query, options);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({
            code: statusCodes.ok.code, 
            message: statusCodes.ok.msg,
            data: data
        });
});


module.exports = router;