const config = require('../../config');
const JSONdata = require('../data');

const statusCodes = JSONdata.StatusCodes;
const errorCodes = JSONdata.ErrorCodes;
const ErrorHandlerConfigurations = config.ErrorHandlerConfigurations;

module.exports = (err, req, res, next) => {

    const attachErrorDetailsToResposne = ErrorHandlerConfigurations.attach_error_details_to_response ? true : false

    res.locals.errorCode = err.errorCode ? err.errorCode : errorCodes.UncategorizedError.code;
    res.locals.errorMessage = err.errorMessage ? err.errorMessage : errorCodes.UncategorizedError.message;
    res.locals.errorDetails = err.errorDetails ? err.errorDetails : `${err.name}: ${err.message}`;

    if ( !err.errorDetails ) console.log('Error: ',err);

    return res.status(statusCodes.ok.code).json({ 
        code: statusCodes.ok.code,
        message: statusCodes.ok.msg,
        error: {
            code: res.locals.errorCode,
            message: res.locals.errorMessage,
            details: attachErrorDetailsToResposne ? res.locals.errorDetails : undefined,
        }
    })

}