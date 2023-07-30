'use strict';
const chalk = require('chalk');
const statusCodes = require('../api/data').StatusCodes;

module.exports = (tokens, req, res) => {

  let status;
  const path = res.req?.route?.path ? res.req?.route?.path : req.originalUrl;
  const message = res.locals.message ? res.locals.message : 'No message' 
  const errorCode = res.locals.errorCode ? res.locals.errorCode : "No errorCode";
  const errorMessage = res.locals.errorMessage ? res.locals.errorMessage : "No errorMessage";
  const errorDetails = res.locals.errorDetails ? 
                          typeof res.locals.errorDetails === 'object' ? JSON.stringify(res.locals.errorDetails) : 
                          res.locals.errorDetails : "No errorDetails";


  if (message === 'No message' && !errorCode ) status = chalk.yellowBright(`[ Warning ] > ${path} | ${message}`);
  else if ( errorCode && errorCode === statusCodes.not_found.code ) status = chalk.yellowBright(`[ Warning ] > ${errorDetails} | ${path}`) 
  else if ( errorCode && errorCode !== "No errorCode" ) status = chalk.redBright(`[ Error ] > ${path} | ${errorCode} | ${errorMessage} | ${errorDetails}`);
  else if ( message === "No message" ) status = chalk.yellowBright(`[ Warning ] > ${path} | ${message}`);
  else status = chalk.greenBright(`[ Success ] > ${path} | ${message}`);

  let time = new Date(new Date().getTime());

  return [
    status,
    time, '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ');
};






