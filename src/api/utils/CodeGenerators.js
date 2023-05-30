const uuid4 = require('uuid4');

function six_digit_code(){
    const code = Math.floor(100000 + Math.random() * 900000)
    return code
}

function uuid4_id(){
    const code = uuid4();
    return code;
}

module.exports = {
    six_digit_code,
    uuid4_id
}