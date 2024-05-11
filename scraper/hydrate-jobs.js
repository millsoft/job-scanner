/**
 * This script hydrates the job entries with the job description.
 * It uses Puppeteer to download the job description from the job listing URL.
 */

const db = require('./common/db');
const Puppeteer = require('./common/puppeteer');

class Hydrator {

    constructor() {
        this.puppeteer = new Puppeteer();
    }

    async getUnhydratedEntries() {
        return await db.read({ hydrated: false });
    }

    async hydrateEntry(entry) {

        const url = entry.url;

        //delete entry with entry.id == null:
        if (entry.id == null) {
            console.log("Deleting entry with id: ", entry.id);
            await db.deleteOne({ id: entry.id });
            return;
        }

        console.log("Hydrating entry: ", entry);

        const puppeteer = await new Puppeteer();
        const page = await puppeteer.page();
        await page.goto(url);

        const response = await page.content();
        try {
            const jobDescriptionElement = await page.$eval("#jobDescriptionText", node => node.textContent);

            const fs = require('fs');
            fs.writeFileSync("debug/lastJob.html", jobDescriptionElement);
            await db.update({ id: entry.id }, { $set: { hydrated: true, description: jobDescriptionElement } })

            console.log("OK");

        } catch (error) {
            console.log("Error for URL: " + url, error);
        }

        puppeteer.closeBrowser();

    }

    async hydrate() {
        const entries = await this.getUnhydratedEntries();

        for (const entry of entries) {
            await this.hydrateEntry(entry);
        };

        console.log("Hydration completed.");

    }

}

(async () => {

    const hydrator = new Hydrator();
    await hydrator.hydrate();


})();