import clientPromise from "../../../../lib/mongodb";

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const status = url.searchParams.get("status");

  try {
    const client = await clientPromise;
    const db = client.db("jobs");
    const result = await db
      .collection("jobListings")
      .updateOne({ id: id }, { $set: { status: status } });

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ status: "error" }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
}
