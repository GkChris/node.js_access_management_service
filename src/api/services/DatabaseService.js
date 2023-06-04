const mongoose = require('mongoose');

const ModifyDocumentError = require('../errors/ModifyDocumentError');
const ValidationFailureError = require('../errors/ValidationError');
const FetchDocumentError = require('../errors/FetchDocumentError');
const ReferenceDocumentError = require('../errors/ReferenceDocumentError');
const FunctionalityError = require('../errors/FunctionalityError');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');
const validations = require('../validations');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;

const User = models.User;
const Client = models.Client;
const Permission = models.Permission;
const Realm = models.Realm;
const Role = models.Role;
const Session = models.Session;


function createRealm(){
    return new Promise(async(resolve, reject) => {

        const realm = {
            name: "Development",
            description: "This realm is used during the development of the application"
        }

        try {

            let newRealm = await Realm.create(realm);
                 
            return resolve(newRealm);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


function createClient(realm){
    return new Promise(async(resolve, reject) => {

        const client = {
            name: "Main",
            description: "This is the main client of the realm. The name should change if more clients are going to be used",
            realmId: realm._id
        }

        try {

            let newClient = await Client.create(client);
                    
            return resolve(newClient);
                
        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}

function createPermissions(){
    return new Promise(async(resolve, reject) => {

        const permissions = [
            {
                name: "Read Basic",
                code: "read_basic",
                description: "Basic read permission that is granted to all authenticated users"
            },
            {
                name: "Admin Panel Access",
                code: "admin_panel_access",
                description: "This description is granted to gain access to the admin panel"
            }
        ]

        try {

            let newPermission = await Permission.insertMany(permissions);
                    
            return resolve(newPermission);
                
        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}

function createRoles(realm, client, permissions){
    return new Promise(async(resolve, reject) => {

        const roles = [
            {
                name: "superadmin",
                description: "The highest role in the hierarchy",
                realmId: realm._id,
                clientId: client._id,
                permissions: permissions
            }
        ]

        try {

            let newRole = await Role.insertMany(roles);
                    
            return resolve(newRole);
                
        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}

function createSuperadmin(realm, client, roles){
    return new Promise(async(resolve, reject) => {


        try {
            const code = utils.CodeGenerators.six_digit_code().toString();
        
            var passwords = {
                unhashedPassword: code,
                hashedPassword: await utils.hashPassword(code)
            }
            var superadmin = {
                sub: utils.CodeGenerators.uuid4_id(),
                username: "Superadmin",
                password: passwords.hashedPassword,
                roleId: roles.find((role => role.name === 'superadmin'))._id,
                realmId: realm._id,
                clientId: client._id,
            }
    
        } catch ( error ) {
            return reject( new FunctionalityError(`${error}`))
        }

        try {

            let newSuperuser = await User.create(superadmin);

            return resolve({username: newSuperuser.username, password: passwords.unhashedPassword});
                
        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


function dropDatabase(){
    return new Promise(async(resolve, reject) => {

        try {

            await User.deleteMany({});
            await Client.deleteMany({});
            await Permission.deleteMany({});
            await Realm.deleteMany({});
            await Role.deleteMany({});
            await Session.deleteMany({});
                 
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


module.exports = {
    createRealm,
    createClient,
    createPermissions,
    createRoles,
    createSuperadmin,
    dropDatabase,
}

