const cache = require('../../config').CacheConfigurations;

function set_cache(originalUrl, response){
    return cache.set(originalUrl, response)
}

module.exports = {
    set_cache
}