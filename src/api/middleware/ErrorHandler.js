const JSONdata= require('../data');

const statusCodes = JSONdata.StatusCodes;


module.exports = (err, req, res, next) => {

    res.locals.message = err.message
   
    switch (true) {
        case err.message.includes(statusCodes.bad_request.msg): {
            return res.status(statusCodes.bad_request.code).json({ 
                message: statusCodes.bad_request.msg,
                code: statusCodes.bad_request.code });
        }
        case err.message.includes(statusCodes.unauthorized.msg): {
            return res.status(statusCodes.unauthorized.code).json({ 
                message: statusCodes.unauthorized.msg,
                code: statusCodes.unauthorized.code });
        }
        case err.message.includes(statusCodes.forbidden.msg): {
            return res.status(statusCodes.forbidden.code).json({ 
                message: statusCodes.forbidden.msg,
                code: statusCodes.forbidden.code });
        }
        case err.message.includes(statusCodes.not_acceptable.msg): {
            return res.status(statusCodes.not_acceptable.code).json({ 
                message: statusCodes.not_acceptable.msg,
                code: statusCodes.not_acceptable.code });
        }
        case err.message.includes(statusCodes.conflict.msg): {
            return res.status(statusCodes.conflict.code).json({ 
                message: statusCodes.conflict.msg,
                code: statusCodes.conflict.code });
        }
        case err.message.includes(statusCodes.unsupported_media_type.msg): {
            return res.status(statusCodes.unsupported_media_type.code).json({ 
                message: statusCodes.unsupported_media_type.msg,
                code: statusCodes.unsupported_media_type.code });
        }
        case err.message.includes(statusCodes.unprocessable_content.msg): {
            return res.status(statusCodes.unprocessable_content.code).json({ 
                message: statusCodes.unprocessable_content.msg,
                code: statusCodes.unprocessable_content.code });
        }
        case err.message.includes(statusCodes.internal_server_error.msg): {
            return res.status(statusCodes.internal_server_error.code).json({ 
                message: statusCodes.internal_server_error.msg,
                code: statusCodes.internal_server_error.code });
        }
        case err.message.includes(statusCodes.bad_gateway.msg): {
            return res.status(statusCodes.bad_gateway.code).json({ 
                message: statusCodes.bad_gateway.msg,
                code: statusCodes.bad_gateway.code });
        }
        
    }

    return res.status(statusCodes.internal_server_error.code.json({message: 'Something went wrong', code: statusCodes.internal_server_error.code}))


}

