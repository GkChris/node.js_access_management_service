function isPlainObject(arg) {
    return Object.prototype.toString.call(arg) === '[object Object]';
}

module.exports = isPlainObject