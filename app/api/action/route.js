import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const client = new MongoClient(process.env.MONGO_URL);

  try {
    const { itemId, newQuantity } = await request.json();
    await client.connect();
    const database = client.db("stock_management");
    const inventory = database.collection("inventory");
    const filter = { slug: itemId };

    const updateDoc = {
      $set: {
        quantity: newQuantity,
      },
    };

    const result = await inventory.findOneAndUpdate(filter, updateDoc, {});

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.error("Internal Server Error", { status: 500 });
  } finally {
    client.close();
  }
}
