module.exports = {
    backend_name: process.env.BACKEND_NAME,
    version: process.env.BACKEND_VERSION,
    protocol: process.env.BACKEND_PROTOCOL,
    ip: process.env.BACKEND_HOST,
    port: process.env.BACKEND_PORT.substring(1),
    environment: process.env.NODE_ENV,
};


