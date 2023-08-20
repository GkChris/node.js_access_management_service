const DatabaseService = require('./src/api/services/DatabaseService');

function initialize(){
    return new Promise(async(resolve, reject) => {
        try {

            let realms = await DatabaseService.createRealms();
            let clients = await DatabaseService.createClients(realms);
            let permissions = await DatabaseService.createPermissions();
            let roles = await DatabaseService.createRoles(realms, clients, permissions);
            var {development, production} = await DatabaseService.createSuperadmins(realms, clients, roles) 

        } catch ( error ) {
            console.log(error)
        }

        console.log(`[development] -> username: ${development.username}, password: ${development.password}`)
        console.log(`[production] -> username: ${production.username}, password: ${production.password}`)
    })
}


initialize()