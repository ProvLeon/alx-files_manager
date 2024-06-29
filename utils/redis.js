const { MongoClient } = require("mongodb");

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || "files_manager";

    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client.connect((err) => {
      if (err) {
        console.error("MongoDB Client Error:", err);
      } else {
        console.log("MongoDB client connected");
        this.db = this.client.db(database);
      }
    });
  }

  isAlive() {
    return (
      this.client && this.client.topology && this.client.topology.isConnected()
    );
  }

  async nbUsers() {
    try {
      return await this.db.collection("users").countDocuments();
    } catch (err) {
      console.error("Error counting users:", err);
      throw err;
    }
  }

  async nbFiles() {
    try {
      return await this.db.collection("files").countDocuments();
    } catch (err) {
      console.error("Error counting files:", err);
      throw err;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
