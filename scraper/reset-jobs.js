/**
 * Reset all jobs in the database
 */

const db = require('./common/db');

(async () => {

    await db.deleteAll();
    console.log("All jobs have been reset!");

})();