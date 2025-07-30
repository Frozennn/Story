const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const HumanBehavior = require('./utils/humanBehavior');
const Logger = require('./utils/logger');

// Use stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

class TravianBot {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger || new Logger();
        this.browser = null;
        this.page = null;
        this.humanBehavior = null;
        this.isRunning = false;
        this.currentVillageIndex = 0;
        this.retryCount = 0;
    }

    async initialize() {
        try {
            this.logger.info('🚀 Initializing Travian Bot...');
            
            // Launch browser with stealth settings
            this.browser = await puppeteer.launch({
                headless: this.config.browser.headless,
                devtools: this.config.browser.devtools,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--disable-features=VizDisplayCompositor',
                    '--window-size=1366,768'
                ],
                defaultViewport: this.config.browser.viewport
            });

            this.page = await this.browser.newPage();
            
            // Set user agent
            await this.page.setUserAgent(this.config.browser.userAgent);
            
            // Set extra headers to appear more human
            await this.page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            });

            // Initialize human behavior
            this.humanBehavior = new HumanBehavior(this.page, this.config.automation.humanBehavior);
            
            this.logger.success('Browser initialized successfully');
            return true;
        } catch (error) {
            this.logger.error('Failed to initialize browser', { error: error.message });
            throw error;
        }
    }

    async login() {
        try {
            this.logger.action('Attempting to login...');
            
            // Navigate to login page
            await this.page.goto(this.config.travian.server, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            
            await this.humanBehavior.naturalPageLoad();

            // Check if already logged in
            const isLoggedIn = await this.checkIfLoggedIn();
            if (isLoggedIn) {
                this.logger.success('Already logged in');
                return true;
            }

            // Find and fill login form
            const loginSelectors = {
                username: 'input[name="name"], input[name="username"], #name, #username',
                password: 'input[name="password"], #password',
                submit: 'button[type="submit"], input[type="submit"], .btn-login, #login'
            };

            // Fill username
            await this.humanBehavior.humanType(
                loginSelectors.username, 
                this.config.travian.username
            );

            // Fill password
            await this.humanBehavior.humanType(
                loginSelectors.password, 
                this.config.travian.password
            );

            // Submit form
            await this.humanBehavior.humanClick(loginSelectors.submit);
            
            // Wait for login to complete
            await this.page.waitForNavigation({ 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });

            await this.humanBehavior.naturalPageLoad();

            // Verify login success
            const loginSuccess = await this.checkIfLoggedIn();
            if (loginSuccess) {
                this.logger.loginSuccess(this.config.travian.username, this.config.travian.server);
                return true;
            } else {
                throw new Error('Login verification failed');
            }

        } catch (error) {
            this.logger.error('Login failed', { error: error.message });
            throw error;
        }
    }

    async checkIfLoggedIn() {
        try {
            // Look for elements that indicate successful login
            const loggedInIndicators = [
                '.village', // Village name
                '#navigation', // Navigation menu
                '.playerName', // Player name
                '[class*="logout"]', // Logout button
                '.rallyPoint' // Rally point
            ];

            for (let selector of loggedInIndicators) {
                try {
                    const element = await this.page.$(selector);
                    if (element) {
                        return true;
                    }
                } catch (error) {
                    // Continue checking
                }
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    async navigateToRallyPoint() {
        try {
            this.logger.action('Navigating to Rally Point...');

            // Common selectors for rally point navigation
            const rallyPointSelectors = [
                'a[href*="rally"], a[href*="rallypoint"]',
                '.rallyPoint a',
                '#navigation a[href*="rally"]',
                'a:contains("Rally Point")',
                'map area[href*="rally"]'
            ];

            let navigated = false;
            for (let selector of rallyPointSelectors) {
                try {
                    const element = await this.page.$(selector);
                    if (element) {
                        await this.humanBehavior.humanClick(selector);
                        await this.page.waitForNavigation({ 
                            waitUntil: 'networkidle2',
                            timeout: 15000 
                        });
                        navigated = true;
                        break;
                    }
                } catch (error) {
                    // Try next selector
                }
            }

            if (!navigated) {
                // Try direct URL approach
                const currentUrl = this.page.url();
                const rallyUrl = currentUrl.replace(/\?.*$/, '') + '?s=1';
                await this.page.goto(rallyUrl, { waitUntil: 'networkidle2' });
            }

            await this.humanBehavior.naturalPageLoad();
            this.logger.success('Successfully navigated to Rally Point');
            return true;

        } catch (error) {
            this.logger.error('Failed to navigate to Rally Point', { error: error.message });
            throw error;
        }
    }

    async navigateToFarmList() {
        try {
            this.logger.action('Navigating to Farm List...');

            // Look for farm list tab or link
            const farmListSelectors = [
                'a[href*="farm"], a[href*="farmlist"]',
                '.farmList a, .farm-list a',
                'a:contains("Farm List")',
                'a:contains("Farm")',
                '.tab a[href*="farm"]'
            ];

            let navigated = false;
            for (let selector of farmListSelectors) {
                try {
                    const element = await this.page.$(selector);
                    if (element) {
                        await this.humanBehavior.humanClick(selector);
                        await this.humanBehavior.wait(2000, 4000);
                        navigated = true;
                        break;
                    }
                } catch (error) {
                    // Try next selector
                }
            }

            if (!navigated) {
                // Try direct URL approach for farm list
                const currentUrl = this.page.url();
                const farmUrl = currentUrl.includes('?') 
                    ? currentUrl + '&t=99' 
                    : currentUrl + '?t=99';
                await this.page.goto(farmUrl, { waitUntil: 'networkidle2' });
            }

            await this.humanBehavior.naturalPageLoad();
            this.logger.success('Successfully navigated to Farm List');
            return true;

        } catch (error) {
            this.logger.error('Failed to navigate to Farm List', { error: error.message });
            throw error;
        }
    }

    async sendAllFarmLists() {
        try {
            this.logger.action('Attempting to send all farm lists...');

            // Check for CAPTCHA before proceeding
            const hasCaptcha = await this.humanBehavior.checkForCaptcha();
            if (hasCaptcha) {
                this.logger.captchaDetected();
                return false;
            }

            // Look for "Send all farm lists" button
            const sendAllSelectors = [
                'button:contains("Send all")',
                'input[value*="Send all"]',
                '.sendAll, .send-all',
                'button[onclick*="sendAll"]',
                'a[href*="sendAll"]',
                '.farmListSendAll',
                'button.btn:contains("Send")'
            ];

            let buttonFound = false;
            for (let selector of sendAllSelectors) {
                try {
                    const element = await this.page.$(selector);
                    if (element) {
                        // Check if button is visible and enabled
                        const isVisible = await element.isIntersectingViewport();
                        const isEnabled = await this.page.evaluate(el => !el.disabled, element);
                        
                        if (isVisible && isEnabled) {
                            await this.humanBehavior.humanClick(selector);
                            buttonFound = true;
                            break;
                        }
                    }
                } catch (error) {
                    // Try next selector
                }
            }

            if (!buttonFound) {
                // Alternative approach: look for individual farm list send buttons
                const individualSendSelectors = [
                    '.farmList .send button',
                    '.farm-list .send button',
                    'button[onclick*="send"]',
                    'input[type="submit"][value*="Send"]'
                ];

                const sendButtons = [];
                for (let selector of individualSendSelectors) {
                    try {
                        const buttons = await this.page.$$(selector);
                        sendButtons.push(...buttons);
                    } catch (error) {
                        // Continue
                    }
                }

                if (sendButtons.length > 0) {
                    this.logger.info(`Found ${sendButtons.length} individual farm lists to send`);
                    
                    for (let i = 0; i < sendButtons.length; i++) {
                        try {
                            const button = sendButtons[i];
                            const isVisible = await button.isIntersectingViewport();
                            const isEnabled = await this.page.evaluate(el => !el.disabled, button);
                            
                            if (isVisible && isEnabled) {
                                await button.click();
                                await this.humanBehavior.wait(1000, 3000);
                            }
                        } catch (error) {
                            this.logger.warn(`Failed to click farm list ${i + 1}`, { error: error.message });
                        }
                    }
                    buttonFound = true;
                }
            }

            if (buttonFound) {
                // Wait for any confirmation dialogs or page updates
                await this.humanBehavior.wait(2000, 5000);
                
                // Check for confirmation dialog
                const confirmSelectors = ['button:contains("OK")', 'button:contains("Yes")', '.confirm'];
                for (let selector of confirmSelectors) {
                    try {
                        const confirmBtn = await this.page.$(selector);
                        if (confirmBtn) {
                            await this.humanBehavior.humanClick(selector);
                            break;
                        }
                    } catch (error) {
                        // No confirmation needed
                    }
                }

                const currentVillage = this.getCurrentVillageName();
                this.logger.farmSent(currentVillage, 'all');
                return true;
            } else {
                throw new Error('Could not find "Send all farm lists" button');
            }

        } catch (error) {
            this.logger.error('Failed to send farm lists', { error: error.message });
            throw error;
        }
    }

    getCurrentVillageName() {
        // This would be implemented to extract current village name from the page
        // For now, return a placeholder
        return `Village ${this.currentVillageIndex + 1}`;
    }

    async switchToNextVillage() {
        try {
            const villages = this.config.travian.villages.filter(v => v.enabled);
            if (villages.length <= 1) {
                return true; // No village switching needed
            }

            this.currentVillageIndex = (this.currentVillageIndex + 1) % villages.length;
            const nextVillage = villages[this.currentVillageIndex];

            this.logger.action(`Switching to village: ${nextVillage.name}`);

            // Look for village dropdown or links
            const villageSelectors = [
                '.village-list a',
                '.villageList a',
                'select[name="village"] option',
                '.village-dropdown a'
            ];

            // This is a simplified implementation
            // In practice, you'd need to identify the specific village switching mechanism
            // used by the Travian server version

            await this.humanBehavior.wait(1000, 3000);
            this.logger.success(`Switched to village: ${nextVillage.name}`);
            return true;

        } catch (error) {
            this.logger.error('Failed to switch village', { error: error.message });
            return false;
        }
    }

    async performFarmingCycle() {
        try {
            this.retryCount = 0;
            
            // Navigate to rally point
            await this.navigateToRallyPoint();
            
            // Navigate to farm list
            await this.navigateToFarmList();
            
            // Send all farm lists
            const success = await this.sendAllFarmLists();
            
            if (success) {
                this.retryCount = 0;
                return true;
            } else {
                throw new Error('Failed to send farm lists');
            }

        } catch (error) {
            this.retryCount++;
            this.logger.error(`Farming cycle failed (attempt ${this.retryCount})`, { 
                error: error.message 
            });

            if (this.retryCount >= this.config.safety.maxRetries) {
                throw new Error(`Max retries (${this.config.safety.maxRetries}) exceeded`);
            }

            // Wait before retry
            await this.humanBehavior.wait(10000, 20000);
            return this.performFarmingCycle();
        }
    }

    async start() {
        try {
            this.isRunning = true;
            this.logger.info('🎯 Starting Travian Farm Automation...');

            // Initialize browser
            await this.initialize();

            // Login
            await this.login();

            // Main automation loop
            while (this.isRunning) {
                try {
                    // Check for CAPTCHA or popups
                    const hasCaptcha = await this.humanBehavior.checkForCaptcha();
                    if (hasCaptcha) {
                        this.logger.captchaDetected();
                        if (this.config.safety.pauseOnCaptcha) {
                            await this.pause();
                            continue;
                        }
                    }

                    const popup = await this.humanBehavior.checkForPopups();
                    if (popup.found) {
                        this.logger.warn('Unexpected popup detected', { selector: popup.selector });
                    }

                    // Perform farming cycle
                    await this.performFarmingCycle();

                    // Switch to next village if multiple villages configured
                    await this.switchToNextVillage();

                    // Wait for next cycle
                    const waitTime = this.humanBehavior.randomDelay(
                        this.config.automation.sendInterval.min,
                        this.config.automation.sendInterval.max
                    );

                    this.logger.info(`⏰ Waiting ${Math.round(waitTime / 1000 / 60)} minutes until next cycle...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));

                } catch (error) {
                    this.logger.error('Error in main loop', { error: error.message });
                    
                    if (this.config.safety.emergencyStop) {
                        this.logger.emergencyStop(error.message);
                        break;
                    }

                    // Wait before continuing
                    await this.humanBehavior.wait(30000, 60000);
                }
            }

        } catch (error) {
            this.logger.error('Critical error in automation', { error: error.message });
            throw error;
        } finally {
            await this.cleanup();
        }
    }

    async pause() {
        this.logger.warn('🛑 Automation paused - manual intervention required');
        this.isRunning = false;
    }

    async stop() {
        this.logger.info('🛑 Stopping automation...');
        this.isRunning = false;
        await this.cleanup();
    }

    async cleanup() {
        try {
            if (this.browser) {
                await this.browser.close();
                this.logger.info('Browser closed successfully');
            }
        } catch (error) {
            this.logger.error('Error during cleanup', { error: error.message });
        }
    }
}

module.exports = TravianBot;