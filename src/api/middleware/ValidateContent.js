const config = require('../../config');
const Validations = require('../validations');
const statusCodes = require('../data').StatusCodes;

const ErrorHandlerConfigurations = config.ErrorHandlerConfigurations;

module.exports = (req, res, next) => {

    let attachErrorToResposne = ErrorHandlerConfigurations.attach_error_to_response ? true : false

    try {
    
        let payload = {};
        if ( req?.query && Object.entries(req.query)?.length > 0 ) payload = req.query;
        else if ( req?.body && Object.entries(req.body)?.length > 0 ) payload = req.body;
        else return next();

        Validations.CommonValidations.is_content_valid(payload)

        next();
    
    } catch ( error ) {
        return res.status(statusCodes.unprocessable_content.code).json({ 
            message: statusCodes.unprocessable_content.msg,
            code: statusCodes.unprocessable_content.code,
            error: attachErrorToResposne ? {
                code: "ERR_VALIDATION_FAILURE",
                message: "Found harmful conent in request's payload"
            } : {}
        });
    }

}

