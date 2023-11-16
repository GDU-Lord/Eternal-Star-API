import Block from "../parser/block.js";
import db from "./index.js";
import { C_ARTICLES } from "../config.js";

export default async function save(articles: Block[]) {

  const collection = db.collection(C_ARTICLES);

  console.log("updating database...");

  try {
    await collection.deleteMany({});

    console.log("articles deleted");
    await collection.insertMany(articles);

    console.log("articles inserted");

    return true;

  } catch(err) {

    console.error(err);
    return false;

  }

}