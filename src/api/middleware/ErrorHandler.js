const config = require('../../config');
const JSONdata = require('../data');

const statusCodes = JSONdata.StatusCodes;
const customCodes = JSONdata.CustomCodes;
const ErrorHandlerConfigurations = config.ErrorHandlerConfigurations;

module.exports = (err, req, res, next) => {

    const attachErrorDetailsToResposne = ErrorHandlerConfigurations.attach_error_details_to_response ? true : false

    res.locals.errorCode = err.errorCode ? err.errorCode : customCodes.UncategorizedError.code;
    res.locals.errorMessage = err.errorMessage ? err.errorMessage : customCodes.UncategorizedError.message;
    res.locals.errorDetails = err.errorDetails ? err.errorDetails : err.message;


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


 // switch (true) {
    //     case err.statusCode === statusCodes.bad_request.code: {
    //         return res.status(statusCodes.bad_request.code).json({ 
    //             code: statusCodes.bad_request.code,
    //             message: statusCodes.bad_request.msg,
    //             error: attachErrorToResposne ? {
    //                 code: res.locals.errorCode,
    //                 message: res.locals.message
    //             } : {}
    //         });
    //     }
    //     case err.statusCode === statusCodes.unauthorized.code: {
    //         return res.status(statusCodes.unauthorized.code).json({ 
    //             code: statusCodes.unauthorized.code,
    //             message: statusCodes.unauthorized.msg,
    //             error: attachErrorToResposne ? {
    //                 code: res.locals.errorCode,
    //                 message: res.locals.message
    //             } : {}
    //         });
    //     }
    //     case err.statusCode === statusCodes.forbidden.code: {
    //         return res.status(statusCodes.forbidden.code).json({ 
    //             code: statusCodes.forbidden.code,
    //             message: statusCodes.forbidden.msg,
    //             error: attachErrorToResposne ? {
    //                 code: res.locals.errorCode,
    //                 message: res.locals.message
    //             } : {}
    //         });
    //     }
    //     case err.statusCode === statusCodes.not_found.code: {
    //         return res.status(statusCodes.not_found.code).json({ 
    //             code: statusCodes.not_found.code,
    //             message: statusCodes.not_found.msg,
    //             error: attachErrorToResposne ? {
    //                 code: res.locals.errorCode,
    //                 message: res.locals.message
    //             } : {}
    //         });
    //     }
    //     case err.statusCode === statusCodes.not_acceptable.code: {
    //         return res.status(statusCodes.not_acceptable.code).json({ 
    //             code: statusCodes.not_acceptable.code,
    //             message: statusCodes.not_acceptable.msg,
    //             error: attachErrorToResposne ? {
    //                 code: res.locals.errorCode,
    //                 message: res.locals.message
    //             } : {}
    //         });
    //     }
    //     case err.statusCode === statusCodes.conflict.code: {
    //         return res.status(statusCodes.conflict.code).json({ 
    //             code: statusCodes.conflict.code,
    //             message: statusCodes.conflict.msg,
    //             error: attachErrorToResposne ? {
    //                 code: res.locals.errorCode,
    //                 message: res.locals.message
    //             } : {}
    //         });
    //     }
    //     case err.statusCode === statusCodes.unsupported_media_type.code: {
    //         return res.status(statusCodes.unsupported_media_type.code).json({ 
    //             code: statusCodes.unsupported_media_type.code,
    //             message: statusCodes.unsupported_media_type.msg,
    //             error: attachErrorToResposne ? {
    //                 code: res.locals.errorCode,
    //                 message: res.locals.message
    //             } : {}
    //         });
    //     }
    //     case err.statusCode === statusCodes.unprocessable_content.code: {
    //         return res.status(statusCodes.ok.code).json({ 
    //             code: statusCodes.unprocessable_content.code,
    //             message: statusCodes.unprocessable_content.msg,
    //             error: attachErrorToResposne ? {
    //                 code: statusCodes.unprocessable_content.code,
    //                 message: res.locals.errorCode,
    //                 details: res.locals.message,
    //             } : {}
    //         });
    //     }
    //     case err.statusCode === statusCodes.internal_server_error.code: {
    //         return res.status(statusCodes.internal_server_error.code).json({ 
    //             code: statusCodes.internal_server_error.code,
    //             message: statusCodes.internal_server_error.msg,
    //             error: attachErrorToResposne ? {
    //                 code: res.locals.errorCode,
    //                 message: res.locals.message
    //             } : {}
    //         });
    //     }
    //     case err.statusCode === statusCodes.bad_gateway.code: {
    //         return res.status(statusCodes.ok.code).json({ 
    //             code: statusCodes.bad_gateway.code,
    //             message: statusCodes.bad_gateway.msg,
    //             error: attachErrorToResposne ? {
    //                 code: res.locals.errorCode,
    //                 message: res.locals.message
    //             } : {}
    //         });
    //     }
        
    // }

    // return res.status(statusCodes.internal_server_error.code).json({code: statusCodes.internal_server_error.code, message: 'Something went wrong'});