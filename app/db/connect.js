const MongoClient = require("mongodb").MongoClient;
const dbName = "membot";
let mongoConnection = null;

class MongoDb {
    async getConnection() {
        if (mongoConnection) return mongoConnection;

        let mongoClient = new MongoClient(process.env.mongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        try {
            mongoConnection = await mongoClient.connect();    
        } catch (e) {

        }


        if (!mongoConnection) return new Error("Fail connection to database");

        return mongoConnection.db(dbName);
    }
}


let mongoInstance = new MongoDb();

module.exports = mongoInstance;