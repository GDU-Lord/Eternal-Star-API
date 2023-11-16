import { DB_NAME, DB_URI } from "../config.js";
import { MongoClient } from "mongodb";

const client = new MongoClient(DB_URI);
const db = client.db(DB_NAME);

export default db;