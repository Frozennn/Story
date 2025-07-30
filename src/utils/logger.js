const winston = require('winston');
const path = require('path');
const moment = require('moment');
const chalk = require('chalk');

class Logger {
    constructor(config = {}) {
        this.config = {
            level: config.level || 'info',
            logToFile: config.logToFile !== false,
            logToConsole: config.logToConsole !== false,
            maxLogFiles: config.maxLogFiles || 5,
            maxLogSize: config.maxLogSize || '10m'
        };

        this.setupLogger();
    }

    setupLogger() {
        const logFormat = winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.errors({ stack: true }),
            winston.format.json()
        );

        const transports = [];

        // Console transport with colors
        if (this.config.logToConsole) {
            transports.push(
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.printf(({ timestamp, level, message, ...meta }) => {
                            const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
                            return `${chalk.gray(timestamp)} ${level}: ${message} ${metaStr}`;
                        })
                    )
                })
            );
        }

        // File transport
        if (this.config.logToFile) {
            transports.push(
                new winston.transports.File({
                    filename: path.join(process.cwd(), 'logs', 'app.log'),
                    format: logFormat,
                    maxsize: this.config.maxLogSize,
                    maxFiles: this.config.maxLogFiles,
                    tailable: true
                }),
                new winston.transports.File({
                    filename: path.join(process.cwd(), 'logs', 'error.log'),
                    level: 'error',
                    format: logFormat,
                    maxsize: this.config.maxLogSize,
                    maxFiles: this.config.maxLogFiles,
                    tailable: true
                })
            );
        }

        this.logger = winston.createLogger({
            level: this.config.level,
            format: logFormat,
            transports
        });
    }

    info(message, meta = {}) {
        this.logger.info(message, { ...meta, timestamp: moment().format() });
    }

    error(message, meta = {}) {
        this.logger.error(message, { ...meta, timestamp: moment().format() });
    }

    warn(message, meta = {}) {
        this.logger.warn(message, { ...meta, timestamp: moment().format() });
    }

    debug(message, meta = {}) {
        this.logger.debug(message, { ...meta, timestamp: moment().format() });
    }

    success(message, meta = {}) {
        this.logger.info(`✅ ${message}`, { ...meta, timestamp: moment().format() });
    }

    action(message, meta = {}) {
        this.logger.info(`🎯 ${message}`, { ...meta, timestamp: moment().format() });
    }

    farmSent(village, listsCount, meta = {}) {
        this.logger.info(`🚜 Farm lists sent from ${village} (${listsCount} lists)`, { 
            ...meta, 
            village, 
            listsCount,
            timestamp: moment().format() 
        });
    }

    loginSuccess(username, server) {
        this.logger.info(`🔐 Successfully logged in as ${username} on ${server}`, {
            username,
            server,
            timestamp: moment().format()
        });
    }

    captchaDetected() {
        this.logger.warn(`🤖 CAPTCHA detected - pausing automation`, {
            timestamp: moment().format()
        });
    }

    emergencyStop(reason) {
        this.logger.error(`🚨 EMERGENCY STOP: ${reason}`, {
            reason,
            timestamp: moment().format()
        });
    }
}

module.exports = Logger;