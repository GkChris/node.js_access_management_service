module.exports = {
    use_authentication: process.env.USE_AUTHENTICATION === 'true' ? true : false,
    use_cors: process.env.USE_CORS === 'true' ? true : false,
    use_cache: process.env.USE_LOCAL_CACHE === 'true' ? true : false,
    use_error_handler: process.env.USE_ERROR_HANDLER === 'true' ? true : false,
    use_helmet: process.env.USE_HELMET === 'true' ? true : false,
    use_logger: process.env.USE_LOGGER === 'true' ? true : false,
    use_body_parser: process.env.USE_BODY_PARSER === 'true' ? true : false,
    use_content_validation: process.env.USE_CONTENT_VALIDATION === 'true' ? true : false,
    use_router: process.env.USE_ROUTER === 'true' ? true : false,
    use_not_found_response: process.env.USE_NOT_FOUND_RESPONSE === 'true' ? true : false,
}