const bcrypt = require('bcrypt');

const FunctionalityError = require("../errors/FunctionalityError");



function hashPassword(password){
    return new Promise((resolve, reject) => {
        try {

            const saltRounds = 14; // Number of salt rounds to apply (higher value = more secure but slower)

            bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
                if (err) {
                    return reject(new FunctionalityError(`Something went wrong while hashing password | ${err}`))
                } else {
                    return resolve(hashedPassword);
                }
            });

        } catch (error) {
            return reject(new FunctionalityError(`Something went wrong while hashing password | ${error}`))
        }
    })      
}


module.exports = hashPassword