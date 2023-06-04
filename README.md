# Description

Simple jwt authentication service build with node.js. It also handles authorization & session management. 

Realms, clients, users, roles, permissions and sessions can be managed through the admin panel. 

# Install, Initialize & Execute

### `npm i`

Install depedencies

### `node initilization.js`

The script creates the first documents in the database (Can be modified later from the admin panel).
The first user (superadmin) will be also created during this process. The username and password credentials will be logged in the terminal when the execution is finished. Use these credential to log in into the panel.

Note: The initilization process will not execute if there are existing documents in the database. 
Note 2: You can also use the database/initializeDatabase endpoint instead of running the script.  

### `npm run dev`

Runs the server in the development mode.

# Set up

Within the .env and config files are located all the configurations that should be managed from the developers. The rest can be handled within the admin panel. Instructions about the file strucure and some basic development concepts of the server can be found in the section `SECTION_NAME` in case you want to customize the server's functionality. 