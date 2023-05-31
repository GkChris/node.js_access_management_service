const mongoose = require('mongoose');
const uuid4 = require('uuid4');

const ValidationFailureError = require('../errors/ValidationError');
const TypeErrorCustom = require('../errors/TypeErrorCustom');

const config = require('../../config');
const JSONdata = require('../data');

const validations = config.Validations;


function mongoose_ObjectId_validation(id){
    let errorMessage = '';

    if ( !id ) errorMessage = 'Missing id' ;
    else if ( !mongoose.Types.ObjectId.isValid(id) ) errorMessage = 'Invalid id'

    if ( !errorMessage ) return true;
    throw new ValidationFailureError(`mongoose_ObjectId_validation | ${errorMessage}`) 
}

function uuid4_validation(id){
    let errorMessage = '';

    if ( !id ) errorMessage = 'Missing id' ;
    else if ( !uuid4.valid(id) ) errorMessage = 'Invalid id'

    if ( !errorMessage ) return true;
    throw new ValidationFailureError(`uuid4_validation | ${errorMessage}`)
}

function six_digit_code_validation(code){
    let errorMessage = '';

    if ( !code ) errorMessage = 'Missing code' ;
    else if ( typeof code != 'number' ) errorMessage = 'Invalid code type. Expecting number'
    else if ( code.toString().length != 6 ) errorMessage = 'Invalid code. Expecting a six digits code'
    
    if ( !errorMessage ) return true;
    throw new ValidationFailureError(`six_digit_code_validation | ${errorMessage}`)
}


function is_content_valid(args){
    let invalid_content = [];
  
    for ( let arg of Object.entries(args) ) {

        let key = arg[0];
        let value = arg[1];

        let { passed, invalid_args } = typeof_switch_case(key, value);

        if ( !passed ) invalid_content = invalid_content.concat(invalid_args);

    }
    
    if ( invalid_content.length == 0 ) return true;
    throw new ValidationFailureError(`Invalid content -> ${invalid_content}`)
}


function is_content_missing(args, value_of_missing_content){
    let missing_content = [];
    
    if ( Object.prototype.toString.call(args) !== '[object Object]' ) {
        throw new TypeErrorCustom(`During "is_content_missing" validation. Expecting an object as first argument`)
    }
    
    if ( !value_of_missing_content ) {
        value_of_missing_content = false; // Default missing value
        console.log(`Missing value_of_missing_content. Default is false`);
    }

    for ( let arg of Object.entries(args) ) {

        let key = arg[0];
        let value = arg[1];

        if ( value === value_of_missing_content ) {
            missing_content.push(`${key} `)
        }

    }
    
    if ( missing_content.length == 0 ) return true;
    throw new ValidationFailureError(`Missing content -> Argument(s): ${missing_content}`)
}


function typeof_switch_case(key, value){
    let invalid_args = [];
    let passed = false;

    switch ( typeof value ){
            
        case ( 'string' ): {
            if ( value.length > validations.max_token_length ) {
                invalid_args.push(`| argument: ${key}, reason: string surpass acceptable size`)
            }
            break;
        } 

        case ( 'number' ): {
            if ( value > validations.max_number_length ) {
                invalid_args.push(`| argument: ${key}, reason: number surpass acceptable limit`)        
            }
            break;
        } 

        case ( 'boolean' ): {
            break;
        } 

        case ( 'undefined' ): {
            invalid_args.push(`| argument: ${key}, reason: undefined value detected`)        
            break;
        } 

        case ( 'object' ): {

            if ( value === null ) {
                invalid_args.push(`| argument: ${key}, reason: null value detected`)        
                break; 
            } 
            
            if ( Array.isArray(value) ){
                for ( let arg of Object.entries(value) ) {

                    let key = arg[0];
                    let value = arg[1];

                    let nested = typeof_switch_case(key, value);

                    if ( !nested.passed ) invalid_args = invalid_args.concat(nested.invalid_args);
                }
                break;
            } 
            
            for ( let arg of Object.entries(value) ) {

                let key = arg[0];
                let value = arg[1];

                let nested = typeof_switch_case(key, value);

                if ( !nested.passed ) invalid_args = invalid_args.concat(nested.invalid_args);
            }
            break;
        } 

        case ( 'bigint'): {
            break;
        } 

        case ( 'symbol'): {
            break;
        } 
    }

    if ( invalid_args.length === 0 ) passed = true;
    return {passed: passed, invalid_args: invalid_args.length > 0 ? invalid_args : false};
}


module.exports = {
    mongoose_ObjectId_validation,
    uuid4_validation,
    six_digit_code_validation,
    is_content_valid,
    is_content_missing
}