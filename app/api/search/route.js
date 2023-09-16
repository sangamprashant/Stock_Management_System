import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const client = new MongoClient(process.env.MONGO_URL);
  const query = request.nextUrl.searchParams.get("query")
  try {
    const database = client.db("stock_management");
    const inventory = database.collection("inventory");
    const Products = await inventory.aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query, $options: "i" } }, // Case-insensitive regex match for 'js' in 'slug'
            //   { quantity: { $regex: "js", $options: "i" } }, // Case-insensitive regex match for 'js' in 'quantity'
            //   { price: { $regex: "js", $options: "i" } }, // Case-insensitive regex match for 'js' in 'price'
            ],
          },
        },
      ]).toArray();
    return NextResponse.json({ Products });
  } catch (error) {
    console.log("Error:",error)
  } finally {
    client.close();
  }
}