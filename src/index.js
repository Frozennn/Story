#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TravianBot = require('./travianBot');
const Logger = require('./utils/logger');

class TravianAutomation {
    constructor() {
        this.config = null;
        this.logger = null;
        this.bot = null;
    }

    loadConfiguration() {
        try {
            // Load config.json
            const configPath = path.join(process.cwd(), 'config.json');
            if (!fs.existsSync(configPath)) {
                throw new Error('config.json not found. Please copy config.json.example and configure it.');
            }

            this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

            // Override with environment variables if available
            if (process.env.TRAVIAN_USERNAME) {
                this.config.travian.username = process.env.TRAVIAN_USERNAME;
            }
            if (process.env.TRAVIAN_PASSWORD) {
                this.config.travian.password = process.env.TRAVIAN_PASSWORD;
            }
            if (process.env.TRAVIAN_SERVER) {
                this.config.travian.server = process.env.TRAVIAN_SERVER;
            }
            if (process.env.HEADLESS_MODE !== undefined) {
                this.config.browser.headless = process.env.HEADLESS_MODE === 'true';
            }
            if (process.env.SEND_INTERVAL_MIN) {
                this.config.automation.sendInterval.min = parseInt(process.env.SEND_INTERVAL_MIN);
            }
            if (process.env.SEND_INTERVAL_MAX) {
                this.config.automation.sendInterval.max = parseInt(process.env.SEND_INTERVAL_MAX);
            }

            // Validate required configuration
            if (!this.config.travian.username || this.config.travian.username === 'YOUR_USERNAME') {
                throw new Error('Please set your Travian username in config.json or TRAVIAN_USERNAME environment variable');
            }
            if (!this.config.travian.password || this.config.travian.password === 'YOUR_PASSWORD') {
                throw new Error('Please set your Travian password in config.json or TRAVIAN_PASSWORD environment variable');
            }

            return true;
        } catch (error) {
            console.error('❌ Configuration Error:', error.message);
            return false;
        }
    }

    async initialize() {
        try {
            // Load configuration
            if (!this.loadConfiguration()) {
                process.exit(1);
            }

            // Initialize logger
            this.logger = new Logger(this.config.logging);
            
            // Initialize bot
            this.bot = new TravianBot(this.config, this.logger);

            // Setup graceful shutdown
            this.setupGracefulShutdown();

            this.logger.info('🎮 Travian Farm Automation initialized successfully');
            this.displayConfiguration();

            return true;
        } catch (error) {
            console.error('❌ Initialization failed:', error.message);
            return false;
        }
    }

    displayConfiguration() {
        this.logger.info('📋 Configuration Summary:');
        this.logger.info(`   Server: ${this.config.travian.server}`);
        this.logger.info(`   Username: ${this.config.travian.username}`);
        this.logger.info(`   Villages: ${this.config.travian.villages.filter(v => v.enabled).length} enabled`);
        this.logger.info(`   Send Interval: ${this.config.automation.sendInterval.min/1000/60}-${this.config.automation.sendInterval.max/1000/60} minutes`);
        this.logger.info(`   Headless Mode: ${this.config.browser.headless ? 'ON' : 'OFF'}`);
        this.logger.info(`   Human Behavior: ${this.config.automation.humanBehavior.enableMouseMovements ? 'ON' : 'OFF'}`);
    }

    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            this.logger.info(`\n🛑 Received ${signal}. Shutting down gracefully...`);
            
            if (this.bot) {
                await this.bot.stop();
            }
            
            this.logger.info('👋 Goodbye!');
            process.exit(0);
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            if (this.logger) {
                this.logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
            } else {
                console.error('Uncaught Exception:', error);
            }
            process.exit(1);
        });

        process.on('unhandledRejection', (reason, promise) => {
            if (this.logger) {
                this.logger.error('Unhandled Rejection:', { reason, promise });
            } else {
                console.error('Unhandled Rejection:', reason);
            }
            process.exit(1);
        });
    }

    async start() {
        try {
            if (!await this.initialize()) {
                return;
            }

            this.logger.info('🚀 Starting Travian Farm Automation...');
            this.logger.info('⚠️  IMPORTANT: This bot is designed to behave like a human player.');
            this.logger.info('⚠️  Use at your own risk. The author is not responsible for any account bans.');
            this.logger.info('⚠️  Press Ctrl+C to stop the automation at any time.');
            
            // Start the bot
            await this.bot.start();

        } catch (error) {
            if (this.logger) {
                this.logger.error('Fatal error:', { error: error.message, stack: error.stack });
            } else {
                console.error('Fatal error:', error);
            }
            process.exit(1);
        }
    }
}

// Main execution
if (require.main === module) {
    const automation = new TravianAutomation();
    automation.start().catch(error => {
        console.error('Failed to start automation:', error);
        process.exit(1);
    });
}

module.exports = TravianAutomation;