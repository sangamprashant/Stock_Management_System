import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const client = new MongoClient(process.env.MONGO_URL);
  try {
    const database = client.db("stock_management");
    const inventory = database.collection("inventory");
    const query = {};
    const Products = await inventory.find(query).toArray();
    return NextResponse.json({ Products });
  } catch (error) {
  } finally {
    client.close();
  }
}
export async function POST(request) {
  try {
    const body = await request.json(); // Parse the JSON request body
    const client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    const database = client.db("stock_management");
    const inventory = database.collection("inventory");
    // Insert the data into the database
    const result = await inventory.insertOne(body);
    // Close the database connection
    client.close();
    return NextResponse.json({
      message: "Product added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}
