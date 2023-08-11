module.exports = {
    MAIN_CLIENT: {
        protocol: process.env.MAIN_CLIENT_PROTOCOL,
        host: process.env.MAIN_CLIENT_HOST,
        port: process.env.MAIN_CLIENT_PORT,
        url: process.env.MAIN_CLIENT_PROTOCOL+process.env.MAIN_CLIENT_HOST+process.env.MAIN_CLIENT_PORT
    },
}