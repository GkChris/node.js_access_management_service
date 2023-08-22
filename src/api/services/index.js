const CommonServices = require('./CommonlServices');
const AuthService = require('./AuthService');
const ApiService = require('./ApiService');
const UserService = require('./UserService');
const SessionService = require('./SessionService');
const RoleService = require('./RoleService');
const RealmService = require('./RealmService');
const ClientService = require('./ClientService');
const PermissionService = require('./PermissionService');

/* Special Service */
const DatabaseService = require('./DatabaseService');

module.exports = {
    CommonServices,
    AuthService,
    ApiService,
    UserService,
    SessionService,
    RoleService,
    RealmService,
    ClientService,
    PermissionService,
    DatabaseService,
}