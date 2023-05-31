'use strict';
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser')

const resolvePath = require('path').resolve;

const chalk = require('chalk');
const figlet = require('figlet');

const config = require('./config');
const appConfigurations = config.AppConfigurations;
const databaseConfigurations = config.DatabaseConfigurations;
const loggers = config.Loggers;


// Express app initialization
var app = express();

// Middleware
if (process.env.NODE_ENV == 'development') app.use(cors())
app.use(helmet());
app.use(morgan(loggers));
app.use(bodyParser.json())
if (process.env.USE_LOCAL_CACHE) app.use(require('./api/middleware/Cache'));
app.use(require('./api/middleware/ValidateContent'));
app.use(require('./api/routes'));
app.use(require('./api/middleware/ErrorHandler'));

app.listen(appConfigurations.port, appConfigurations.ip, () => {

  console.log(chalk.yellow(figlet.textSync(appConfigurations.backend_name, { font: 'Slant' })));
  console.log(chalk.yellow(figlet.textSync(appConfigurations.version, { font: 'Slant' })));
  
  console.log(chalk.cyanBright('  Server Info'));
  console.log(chalk.cyanBright('  -----------'));
  console.log(chalk.cyanBright('> IP address: ' + appConfigurations.ip));
  console.log(chalk.cyanBright('> Port: ' + appConfigurations.port));
  console.log(chalk.cyanBright('> DB url: ' + databaseConfigurations.database));
  console.log('\n');
});

