const config = require('../../config');
const JSONdata = require('../data');

const statusCodes = JSONdata.StatusCodes;
const ErrorHandlerConfigurations = config.ErrorHandlerConfigurations;

module.exports = (err, req, res, next) => {

    let attachErrorToResposne = ErrorHandlerConfigurations.attach_error_to_response ? true : false

    res.locals.message = err.message;
    res.locals.errorCode = err.code;
    res.locals.statusCode = err.statusCode;
    res.locals.statusMessage = err.statusMessage;

    switch (true) {
        case err.statusCode === statusCodes.bad_request.code: {
            return res.status(statusCodes.bad_request.code).json({ 
                message: statusCodes.bad_request.msg,
                code: statusCodes.bad_request.code,
                error: attachErrorToResposne ? {
                    code: res.locals.errorCode,
                    message: res.locals.message
                } : {}
            });
        }
        case err.statusCode === statusCodes.unauthorized.code: {
            return res.status(statusCodes.unauthorized.code).json({ 
                message: statusCodes.unauthorized.msg,
                code: statusCodes.unauthorized.code,
                error: attachErrorToResposne ? {
                    code: res.locals.errorCode,
                    message: res.locals.message
                } : {}
            });
        }
        case err.statusCode === statusCodes.forbidden.code: {
            return res.status(statusCodes.forbidden.code).json({ 
                message: statusCodes.forbidden.msg,
                code: statusCodes.forbidden.code,
                error: attachErrorToResposne ? {
                    code: res.locals.errorCode,
                    message: res.locals.message
                } : {}
            });
        }
        case err.statusCode === statusCodes.not_found.code: {
            return res.status(statusCodes.not_found.code).json({ 
                message: statusCodes.not_found.msg,
                code: statusCodes.not_found.code,
                error: attachErrorToResposne ? {
                    code: res.locals.errorCode,
                    message: res.locals.message
                } : {}
            });
        }
        case err.statusCode === statusCodes.not_acceptable.code: {
            return res.status(statusCodes.not_acceptable.code).json({ 
                message: statusCodes.not_acceptable.msg,
                code: statusCodes.not_acceptable.code,
                error: attachErrorToResposne ? {
                    code: res.locals.errorCode,
                    message: res.locals.message
                } : {}
            });
        }
        case err.statusCode === statusCodes.conflict.code: {
            return res.status(statusCodes.conflict.code).json({ 
                message: statusCodes.conflict.msg,
                code: statusCodes.conflict.code,
                error: attachErrorToResposne ? {
                    code: res.locals.errorCode,
                    message: res.locals.message
                } : {}
            });
        }
        case err.statusCode === statusCodes.unsupported_media_type.code: {
            return res.status(statusCodes.unsupported_media_type.code).json({ 
                message: statusCodes.unsupported_media_type.msg,
                code: statusCodes.unsupported_media_type.code,
                error: attachErrorToResposne ? {
                    code: res.locals.errorCode,
                    message: res.locals.message
                } : {}
            });
        }
        case err.statusCode === statusCodes.unprocessable_content.code: {
            return res.status(statusCodes.unprocessable_content.code).json({ 
                message: statusCodes.unprocessable_content.msg,
                code: statusCodes.unprocessable_content.code,
                error: attachErrorToResposne ? {
                    code: res.locals.errorCode,
                    message: res.locals.message
                } : {}
            });
        }
        case err.statusCode === statusCodes.internal_server_error.code: {
            return res.status(statusCodes.internal_server_error.code).json({ 
                message: statusCodes.internal_server_error.msg,
                code: statusCodes.internal_server_error.code,
                error: attachErrorToResposne ? {
                    code: res.locals.errorCode,
                    message: res.locals.message
                } : {}
            });
        }
        case err.statusCode === statusCodes.bad_gateway.code: {
            return res.status(statusCodes.ok.code).json({ 
                message: statusCodes.bad_gateway.msg,
                code: statusCodes.bad_gateway.code,
                error: attachErrorToResposne ? {
                    code: res.locals.errorCode,
                    message: res.locals.message
                } : {}
            });
        }
        
    }

    return res.status(statusCodes.internal_server_error.code.json({message: 'Something went wrong', code: statusCodes.internal_server_error.code}))


}

