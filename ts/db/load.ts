import { C_ARTICLES } from "../config.js";
import db from "../db/index.js";

export async function article(id: string) {
  try {
    return await db.collection(C_ARTICLES).findOne({ id });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function articleList() {
  try {
    return await db.collection(C_ARTICLES).find().project({ title: 1, id: 1, images: 1 }).toArray();
  } catch (err) {
    console.error(err);
    return [];
  }
}