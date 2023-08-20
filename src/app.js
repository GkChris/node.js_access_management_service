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
const middlewareConfig = config.MiddlewareConfigurations;
const databaseConfigurations = config.DatabaseConfigurations;
const Domains = config.Domains;


// Express app initialization
var app = express();

// Middleware
if ( middlewareConfig.use_cors ) app.use(cors({ credentials: true, origin: Domains.MAIN_CLIENT.url}))
if ( middlewareConfig.use_helmet ) app.use(helmet());
if ( middlewareConfig.use_logger ) app.use(morgan(require('./api/middleware/Logger')));
if ( middlewareConfig.use_body_parser ) app.use(bodyParser.json())
if ( middlewareConfig.use_cache ) app.use(require('./api/middleware/Cache'));
if ( middlewareConfig.use_content_validation ) app.use(require('./api/middleware/ValidateContent'));
if ( middlewareConfig.use_authentication ) app.use(require('./api/middleware/Authentication'));
if ( middlewareConfig.use_router ) app.use(require('./api/routes'));
if ( middlewareConfig.use_error_handler ) app.use(require('./api/middleware/ErrorHandler'));
if ( middlewareConfig.use_not_found_response ) app.use(require('./api/middleware/EndpointNotFound')); // Custom 404 middleware

app.listen(appConfigurations.port, appConfigurations.ip, () => {

  console.log(chalk.yellow(figlet.textSync(appConfigurations.backend_name, { font: 'Slant' })));
  console.log(chalk.yellow(figlet.textSync(`V.${appConfigurations.version}`, { font: 'Slant' })));
  
  console.log(chalk.cyanBright('  Server Info'));
  console.log(chalk.cyanBright('  -----------'));
  console.log(chalk.cyanBright('> IP address: ' + appConfigurations.ip));
  console.log(chalk.cyanBright('> Port: ' + appConfigurations.port));
  console.log(chalk.cyanBright('> Database: ' + databaseConfigurations.database));
  console.log(chalk.cyanBright('> Environment: ' + appConfigurations.environment));
  console.log('\n');
});