/**
 * This script is used to scrape job listings from Indeed.com
 * It uses Puppeteer to scrape the job listings from the website.
 */

const Puppeteer = require('./common/puppeteer');
const db = require('./common/db');
const scraperOptions = require('../scraper-options.json');

class JobListingParser {

    jobListings = [];
    searchKeyword = "php";

    async parseJobListings(pageNumber) {

        const puppeteer = new Puppeteer();
        const page = await puppeteer.page();

        const start = (pageNumber * 10)
        //environmnent variable: INDEED_BASE_URL
        const indeedBaseUrl = process.env.INDEED_BASE_URL ?? "https://de.indeed.com";
        await page.goto(`${indeedBaseUrl}/Jobs?q=${this.searchKeyword}&sc=0kf%3Aattr%28DSQF7%29%3B&sort=date&start=${start}`);

        const jobNodeList = await page.$$('#mosaic-provider-jobcards>ul>li');

        //not iterate through the job listings and extract the title and company name:
        for (let i = 0; i < jobNodeList.length; i++) {
            try {

                const title = await jobNodeList[i].$eval('h2 a', node => node.innerText);
                const company = await jobNodeList[i].$eval('.company_location', node => node.innerText);

                const url = await jobNodeList[i].$eval('h2 a', node => node.getAttribute('href'));
                const jk = await jobNodeList[i].$eval('h2 a', node => node.getAttribute('data-jk'));

                let newUrl = `${indeedBaseUrl}/viewjob?jk=${jk}`;

                this.jobListings.push({

                    //the unique identifier of the job listing
                    id: jk,

                    //the job title
                    title,

                    //the name of the company
                    company,

                    //the URL of the job listing
                    url: newUrl,

                    //when was this job listing created?
                    createdAt: new Date(),

                    //job description
                    description: "",

                    //was this job description downloaded?
                    hydrated: false,

                    //was this job checked by AI?
                    checked: false,

                    //status: 0 = not checked, 1 = not interesting, 2 = will apply, 3 = applied
                    status: 0
                });

            } catch (error) {
                console.log("Error!", error);
            }
        }

        console.log(this.jobListings);
        console.log("COUNT: ", this.jobListings.length);

        await puppeteer.closeBrowser();


    }

    async exportJobListings() {
        const fileName = `debug/jobListings.json`;
        const fs = require('fs');
        console.log("Exporting job listings to file...")

        //remove the duplicates from the jobListings array (based on the URL)
        const uniqueJobListings = this.jobListings.filter((job, index, self) =>
            index === self.findIndex((t) => (
                t.id === job.id
            ))
        );

        await db.write(uniqueJobListings);

        fs.writeFileSync(fileName, JSON.stringify(uniqueJobListings, null, 2));
        console.log(`Job listings have been saved to ${fileName}`);
    }
}

(async () => {

    const parser = new JobListingParser();

    for (const search of scraperOptions.searches) {
        parser.searchKeyword = search.keyword;
        const pages = search.pages ?? scraperOptions.pages ?? 1;
        console.log("PAGES=", pages)

        for (let i = 0; i < pages; i++) {
            console.log("Parsing page: ", i);
            await parser.parseJobListings(i);
        }

    }

    //export the job listings:
    await parser.exportJobListings();

})();