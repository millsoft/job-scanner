import clientPromise from "../../../lib/mongodb";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const limit = parseInt(url.searchParams.get('pageSize') || '10', 10);
    const sortField = url.searchParams.get('sortField') || 'createdAt'; // default sorting field
    const sortOrder = url.searchParams.get('sortOrder') === 'desc' ? -1 : 1;

    try {
        const client = await clientPromise;
        const db = client.db("jobs");
        const data = await db.collection("jobListings")
            .find({})
            .sort({ [sortField]: sortOrder })
            .skip(page * limit)
            .limit(limit)
            .toArray();
        const total = await db.collection("jobListings").countDocuments();

        return new Response(JSON.stringify({ data, total }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200
        });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ status: "error" }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 500
        });
    }
}


// Update route (PUT)
export async function PUT(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();

    try {
        const client = await clientPromise;
        const db = client.db("jobs");
        //const result = await db.collection("jobListings").updateOne({ id: id }, { $set: { manual: body.manual } });
        //update full document:
        const result = await db.collection("jobListings").updateOne({ id: id }, { $set: body });

        return new Response(JSON.stringify(result), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200
        });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ status: "error" }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 500
        });
    }
}