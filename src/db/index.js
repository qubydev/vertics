import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "vertics";

if (!uri) {
    throw new Error("MONGODB_URI is not set");
}

const globalForMongo = globalThis;

if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = new MongoClient(uri);
}

export const mongoClient = globalForMongo.mongoClient;
export const db = mongoClient.db(dbName);

export const collections = {
    users: db.collection("user"),
    sessions: db.collection("session"),
    accounts: db.collection("account"),
    verifications: db.collection("verification"),
    sites: db.collection("site"),
    analyticsEvents: db.collection("analytics_event"),
};

export function withoutMongoId(doc) {
    if (!doc) return doc;
    const { _id, ...rest } = doc;
    return rest;
}
