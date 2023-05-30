module.exports = {
    backend_name: 'JWT Authentication',
    version: 'V.1.0',
    protocol: process.env.BACKEND_PROTOCOL || 'http://',
    ip: process.env.BACKEND_HOST || '127.0.0.1',
    port: parseInt(process.env.BACKEND_PORT.substring(1) || '8080', 10),
};


