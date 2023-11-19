'use strict';
const chalk = require('chalk');
const statusCodes = require('../data').StatusCodes;

module.exports = (tokens, req, res) => {
	let status;
	let logError = false;
	let statusCode = res.data?.code ? res.data.code : res.statusCode;
	let statusMessage = res.data?.message ? res.data.message : res.statusMessage;
	const requestMethod = req.method;
	const responseTime = `${tokens['response-time'](req, res)} ms`;
	const time = new Date().toUTCString();
	const path = res.req?.route?.path ? res.req?.route?.path : req.originalUrl;
	const message = res.locals?.message;
	const errorCode = res.locals?.errorCode;
	const errorMessage = res.locals?.errorMessage;
	const errorDetails = res.locals?.errorDetails
		? typeof res.locals.errorDetails === 'object'
		? JSON.stringify(res.locals.errorDetails)
		: res.locals.errorDetails
		: false;

	if (!errorCode && !errorMessage && !errorDetails) {
		status = chalk.green(`[ ${chalk.bold('Success')} ]`);
	} else if (statusCode === statusCodes.not_found.code) {
		status = chalk.yellowBright(`[ ${chalk.bold('Warning')} ]`);
	} else {
		status = chalk.red(`[ ${chalk.bold('Error')} ]`);
		statusCode = errorCode;
		statusMessage = errorMessage;
		logError = true;
	}

	return [
		status,
		' > ',
		chalk.blueBright(path),
		' | ',
		chalk.cyan(requestMethod),
		' | ',
		`${chalk.bold(`${statusCode} ${statusMessage}`)}`,
		`${logError ? ` ${chalk.redBright(errorDetails)}` : ''}`,
		`${message ? ` ${chalk.yellowBright(errorDetails)}` : ''}`,
		' | ',
		`[${chalk.gray(time)}]`,
		' | ',
		chalk.magenta(responseTime),
	].join(' ');
};
