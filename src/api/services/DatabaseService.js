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
const errorCodes = JSONdata.ErrorCodes;

const User = models.User;
const Client = models.Client;
const Permission = models.Permission;
const Realm = models.Realm;
const Role = models.Role;
const Session = models.Session;


function createRealms(){
    return new Promise(async(resolve, reject) => {

        const dev_realm = {
            name: "Development",
            description: "This realm is used during the development of the application"
        }

        const prod_realm = {
            name: "Production",
            description: "This realm is used at production"
        }

        try {

            const newDevRealm = await Realm.create(dev_realm);
            const newProdRealm = await Realm.create(prod_realm);
                 
            return resolve({devRealm: newDevRealm, prodRealm: newProdRealm});

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


function createClients(realms){
    return new Promise(async(resolve, reject) => {

        const devClient = {
            name: "Main",
            description: "This is the main client of the realm. The name should change if more clients are going to be used",
            realmId: realms.devRealm._id
        }

        const prodClient = {
            name: "Main",
            description: "This is the main client of the realm. The name should change if more clients are going to be used",
            realmId: realms.prodRealm._id
        }

        try {

            const newDevClient = await Client.create(devClient);
            const newProdClient = await Client.create(prodClient);
                    
            return resolve({devClient: newDevClient, prodClient: newProdClient});
                
        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}

function createPermissions(){
    return new Promise(async(resolve, reject) => {

        const basic_permission = {
            name: "Read Basic",
            code: "read_basic",
            description: "Basic read permission that is granted to all authenticated users"
        }

        const admin_permission = {
            name: "Admin Panel Access",
            code: "admin_panel_access",
            description: "This description is granted to gain access to the admin panel"
        }

        try {

            const newBasicPermission = await Permission.create(basic_permission);
            const newAdminPermission = await Permission.create(admin_permission);
                    
            return resolve({basicPermissionId: newBasicPermission._id, adminPermissionId: newAdminPermission._id});
                
        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}

function createRoles(realms, clients, permissions){
    return new Promise(async(resolve, reject) => {

        const devRoles = [
            {
                name: "superadmin",
                description: "The highest role in the hierarchy",
                realmId: realms.devRealm._id,
                clientId: clients.devClient._id,
                permissions: [permissions.basicPermissionId, permissions.adminPermissionId]
            },
            {
                name: "user",
                description: "This role is used for authenticated users",
                realmId: realms.devRealm._id,
                clientId: clients.devClient._id,
                permissions: [permissions.basicPermissionId]
            },
        ]

        const prodRoles = [
            {
                name: "superadmin",
                description: "The highest role in the hierarchy",
                realmId: realms.prodRealm._id,
                clientId: clients.prodClient._id,
                permissions: [permissions.basicPermissionId, permissions.adminPermissionId]
            },
            {
                name: "user",
                description: "This role is used for authenticated users",
                realmId: realms.prodRealm._id,
                clientId: clients.prodClient._id,
                permissions: [permissions.basicPermissionId]
            },
        ]

        try {

            const newDevRoles = await Role.insertMany(devRoles);
            const newProdRoles = await Role.insertMany(prodRoles);
                    
            return resolve({devRoles: newDevRoles, prodRoles: newProdRoles});
                
        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}

function createSuperadmins(realms, clients, roles){
    return new Promise(async(resolve, reject) => {


        try {
            const devCode = utils.CodeGenerators.six_digit_code().toString();
            const prodCode = utils.CodeGenerators.six_digit_code().toString();
        
            var devPasswords = {
                unhashedPassword: devCode,
                hashedPassword: await utils.hashPassword(devCode)
            }

            var prodPasswords = {
                unhashedPassword: prodCode,
                hashedPassword: await utils.hashPassword(prodCode)
            }

            var devSuperadmin = {
                sub: utils.CodeGenerators.uuid4_id(),
                username: "Superadmin",
                email: '-',
                password: devPasswords.hashedPassword,
                roleId: roles.devRoles.find((role => role.name === 'superadmin'))._id,
                realmId: realms.devRealm._id,
                clientId: clients.devClient._id,
            }

            var prodSuperadmin = {
                sub: utils.CodeGenerators.uuid4_id(),
                username: "Superadmin",
                email: '-',
                password: prodPasswords.hashedPassword,
                roleId: roles.prodRoles.find((role => role.name === 'superadmin'))._id,
                realmId: realms.prodRealm._id,
                clientId: clients.prodClient._id,
            }
    
        } catch ( error ) {
            return reject( new FunctionalityError(`${error}`))
        }

        try {

            const newDevSuperuser = await User.create(devSuperadmin);
            const newProdSuperuser = await User.create(prodSuperadmin);

            return resolve({
                development: {username: newDevSuperuser.username, password: devPasswords.unhashedPassword},
                production: {username: newProdSuperuser.username, password: prodPasswords.unhashedPassword},
            });
                
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
    createRealms,
    createClients,
    createPermissions,
    createRoles,
    createSuperadmins,
    dropDatabase,
}

