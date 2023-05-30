const LRU = require("lru-cache");

const cache = new LRU({
    max: 500, // maximum number of items in the cache
    ttl: 1000 * 60 * 60 // time in milliseconds before an item is considered stale
});

module.exports = cache