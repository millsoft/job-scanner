const puppeteer = require('puppeteer');

class Puppeteer {
    
    headless = false;

    constructor(headless = false){
        this.headless = headless;
    }
    
    async initBrowser(){
        if(this.browser){
            return this.browser;
        }

        this.browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            headless: this.headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        return this.browser;
    }

    async closeBrowser(){
        await this.browser.close();
    }

    async page() {
        await this.initBrowser();
        const page = await this.browser.newPage();
        return page;
    }
}


module.exports = Puppeteer;