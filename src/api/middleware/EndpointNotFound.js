const config = require('../../config');
const JSONdata = require('../data');

const statusCodes = JSONdata.StatusCodes;
const ErrorHandlerConfigurations = config.ErrorHandlerConfigurations;

module.exports = (req, res) => {

    const attachErrorDetailsToResposne = ErrorHandlerConfigurations.attach_error_details_to_response ? true : false

    res.locals.errorCode = statusCodes.not_found.code;
    res.locals.errorMessage = statusCodes.not_found.msg;
    res.locals.errorDetails = "Endpoint not found";


    return res.status(statusCodes.not_found.code).json({ 
        code: statusCodes.not_found.code,
        message: statusCodes.not_found.msg,
        error: {
            code: res.locals.errorCode,
            message: res.locals.errorMessage,
            details: attachErrorDetailsToResposne ? res.locals.errorDetails : undefined,
        }
    })

}