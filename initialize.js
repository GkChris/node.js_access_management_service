const DatabaseService = require('./src/api/services/DatabaseService');

function initialize(){
    return new Promise(async(resolve, reject) => {
        try {

            let realm = await DatabaseService.createRealm();
            let client = await DatabaseService.createClient(realm);
            let permissions = await DatabaseService.createPermissions();
            let roles = await DatabaseService.createRoles(realm, client, permissions);
            var {username, password} = await DatabaseService.createSuperadmin(realm, client, roles) 

        } catch ( error ) {
            console.log(error)
        }

        console.log(`username: ${username}, password: ${password}`)
    })
}


initialize()