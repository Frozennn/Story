class HumanBehavior {
    constructor(page, config = {}) {
        this.page = page;
        this.config = {
            enableMouseMovements: config.enableMouseMovements !== false,
            enableScrolling: config.enableScrolling !== false,
            enableHover: config.enableHover !== false,
            randomizeTimings: config.randomizeTimings !== false
        };
    }

    // Generate random delay within specified range
    randomDelay(min = 1000, max = 3000) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Wait for random delay
    async wait(min = 1000, max = 3000) {
        const delay = this.randomDelay(min, max);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Simulate human-like mouse movement
    async moveMouseRandomly() {
        if (!this.config.enableMouseMovements) return;

        const viewport = await this.page.viewport();
        const x = Math.floor(Math.random() * viewport.width);
        const y = Math.floor(Math.random() * viewport.height);
        
        await this.page.mouse.move(x, y, { steps: Math.floor(Math.random() * 10) + 5 });
        await this.wait(100, 500);
    }

    // Simulate natural scrolling
    async scrollRandomly() {
        if (!this.config.enableScrolling) return;

        const scrollDistance = Math.floor(Math.random() * 300) + 100;
        const direction = Math.random() > 0.5 ? 1 : -1;
        
        await this.page.evaluate((distance, dir) => {
            window.scrollBy(0, distance * dir);
        }, scrollDistance, direction);
        
        await this.wait(500, 1500);
    }

    // Hover over element before clicking
    async hoverElement(selector) {
        if (!this.config.enableHover) return;

        try {
            await this.page.hover(selector);
            await this.wait(200, 800);
        } catch (error) {
            // Ignore hover errors
        }
    }

    // Human-like click with random offset
    async humanClick(selector, options = {}) {
        try {
            await this.page.waitForSelector(selector, { timeout: 10000 });
            
            if (this.config.enableHover) {
                await this.hoverElement(selector);
            }

            // Get element bounding box for random click position
            const element = await this.page.$(selector);
            const box = await element.boundingBox();
            
            if (box) {
                // Add small random offset to click position
                const offsetX = Math.floor(Math.random() * 10) - 5;
                const offsetY = Math.floor(Math.random() * 10) - 5;
                
                const clickX = box.x + box.width / 2 + offsetX;
                const clickY = box.y + box.height / 2 + offsetY;
                
                // Random delay before click
                await this.wait(
                    options.delayMin || 500,
                    options.delayMax || 2000
                );
                
                await this.page.mouse.click(clickX, clickY);
            } else {
                // Fallback to regular click
                await element.click();
            }
            
            await this.wait(100, 500);
            return true;
        } catch (error) {
            throw new Error(`Failed to click element ${selector}: ${error.message}`);
        }
    }

    // Type text with human-like delays
    async humanType(selector, text, options = {}) {
        try {
            await this.page.waitForSelector(selector, { timeout: 10000 });
            await this.page.focus(selector);
            
            // Clear existing text
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('a');
            await this.page.keyboard.up('Control');
            await this.page.keyboard.press('Backspace');
            
            // Type with random delays between characters
            for (let char of text) {
                await this.page.keyboard.type(char);
                if (this.config.randomizeTimings) {
                    await this.wait(50, 200);
                }
            }
            
            await this.wait(200, 500);
            return true;
        } catch (error) {
            throw new Error(`Failed to type in element ${selector}: ${error.message}`);
        }
    }

    // Simulate reading page content
    async simulateReading() {
        await this.moveMouseRandomly();
        await this.scrollRandomly();
        await this.wait(2000, 5000);
    }

    // Check for common anti-bot elements
    async checkForCaptcha() {
        const captchaSelectors = [
            '[class*="captcha"]',
            '[id*="captcha"]',
            'iframe[src*="recaptcha"]',
            '.g-recaptcha',
            '[class*="challenge"]',
            '[id*="challenge"]'
        ];

        for (let selector of captchaSelectors) {
            try {
                const element = await this.page.$(selector);
                if (element) {
                    const isVisible = await element.isIntersectingViewport();
                    if (isVisible) {
                        return true;
                    }
                }
            } catch (error) {
                // Continue checking other selectors
            }
        }

        return false;
    }

    // Check for unexpected popups or modals
    async checkForPopups() {
        const popupSelectors = [
            '[class*="modal"]',
            '[class*="popup"]',
            '[class*="dialog"]',
            '[role="dialog"]',
            '[class*="overlay"]'
        ];

        for (let selector of popupSelectors) {
            try {
                const element = await this.page.$(selector);
                if (element) {
                    const isVisible = await element.isIntersectingViewport();
                    if (isVisible) {
                        return { found: true, selector };
                    }
                }
            } catch (error) {
                // Continue checking
            }
        }

        return { found: false };
    }

    // Simulate natural page navigation behavior
    async naturalPageLoad() {
        await this.wait(2000, 5000); // Wait for page load
        await this.simulateReading(); // Simulate reading content
    }
}

module.exports = HumanBehavior;