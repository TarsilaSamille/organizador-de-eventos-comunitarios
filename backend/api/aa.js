const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string
const url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.3s7ir2u.mongodb.net/eventos-comunitarios?retryWrites=true&w=majority&authSource=admin`;

// Connect to your Atlas cluster
const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to Atlas");
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
