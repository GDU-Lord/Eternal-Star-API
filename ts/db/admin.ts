import db from "./index.js";

export async function validateKey (tag: string, key: string) {
  try {
    const res = await db.collection("admin").findOne({ tag, key });
    if(res == null) return false;
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}