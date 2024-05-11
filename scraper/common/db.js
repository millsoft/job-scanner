// Import the MongoDB client
const { MongoClient } = require('mongodb');

// Connection URL and database settings
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = 'jobs';

async function write(data) {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('jobListings');
    
    //create index based on the id field:
    await collection.createIndex({ id: 1 }, { unique: true });


    // Create some data to insert
    try{
    const insertResult = await collection.insertMany(data, { ordered: false});
    console.log('Inserted documents:', insertResult.insertedCount);
    } catch (error) {
        if(error.code === 11000){
            console.log("Duplicate entry found. Skipping...")
        }
    }

    // Close connection
    await client.close();
}

//update the hydrated field for a given entry:
async function update(query, data) {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('jobListings');

    //const query = { id: "ae325d7375eb73d3" };
    //const data = { $set: { hydrated: true } };

    const result = await collection.updateOne(query, data);
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);

    await client.close();
}

//get all entries where hydrated is false
async function read(query, limit = 0) {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('jobListings');

    //const query = { hydrated: false };
    const options = {
        projection: { _id: 0 },
    };

    //get all entries limit 1:
    const cursor = collection.find(query, options);
    if(limit > 0){
        cursor.limit(limit);
    }

    const results = await cursor.toArray();
    
    await client.close();
    return results;
}

async function deleteAll() {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('jobListings');

    const result = await collection.deleteMany({});
    console.log(`Deleted ${result.deletedCount} documents`);

    await client.close();
}

async function deleteOne(query) {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('jobListings');

    const result = await collection.deleteOne(query);
    console.log(`Deleted ${result.deletedCount} documents`);

    await client.close();
}

module.exports = { write, read, update, deleteAll, deleteOne};
