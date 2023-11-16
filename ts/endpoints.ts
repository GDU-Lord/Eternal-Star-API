import express from 'express';
import * as load from './db/load.js';
import save from './db/save.js';
import cors from 'cors';
import { CLIENT_ORIGIN } from './config.js';
import { __dirname } from './index.js';
import * as path from "path";
import { validateKey } from './db/admin.js';
import * as fs from "fs";
import * as parser from "./parser/index.js";
import Block from './parser/block.js';
import Span from './parser/span.js';

const CORS = cors({
  origin: CLIENT_ORIGIN
});

export const app = express();

app.use(CORS, express.urlencoded());

app.get("/article", async (req, res): Promise<any> => {
  const article = await load.article((req.query["id"] ?? "") as string);
  if(article == null)
    return res.sendStatus(404);
  res.status(200).send(article);
});

app.get("/articles", async (req, res): Promise<any> => {
  const articles = await load.articleList();
  res.status(200).send(articles);
});

app.get("/images/:image", async (req, res) => {
  const name = req.path.replace("/images/", "");
  try {
    res.sendFile(path.join(__dirname, "/data/images/", name));
  } catch (err) {
    console.error(err);
    res.sendStatus(404);
  }
});

app.get("/gallery*", async (req, res) => {
  const dir = path.join(__dirname, "data", "images", ...req.path.split("/").map(url => decodeURIComponent(url)).slice(2));
  fs.readdir(dir, (err, files) => {
    if(err == null) {
      res.status(200).send(files);
      return;
    }
    if(err.code === "ENOTDIR") {
      res.status(200).sendFile(dir);
      return;
    }
    if(err.code === "ENOENT") {
      res.sendStatus(404);
      return;
    }
    console.error(err);
    res.sendStatus(404);
  });
});

app.get("/admin/update", async (req, res) => {
  const key = req.query["key"] as string;
  console.log(key);
  const isValid = await validateKey("PARSE_API_KEY", key);
  if(!isValid) {
    res.sendStatus(403);
    return;
  }
  console.log("file loading...");

  fs.readFile('./data/input.html', "utf-8", async function (err, data) {
    if(err != null) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    console.log("file loaded");
    console.log("processing...");

    parser.parentList.clear();

    const json = parser.toJSON(data);
    console.log("parsed to json");

    const parts = parser.getParts(json);

    console.log("parts extracted");

    const articles: Block[] = [];
    const indexData = parts.map(parser.getArticles).map(parser.indexArticles);//.forEach(block => articles.push(...block));
    let ids: parser.ids = {};
    const links: Span[] = [];

    console.log("articles indexed");

    for(const index of indexData) {
      ids = {
        ...ids,
        ...index.ids
      };
      links.push(...index.links);
    }

    console.log("indices parsed");

    parser.createLinks(links, ids);
    indexData.forEach(index => articles.push(...index.blocks));

    console.log("articles extracted");
    console.log("done!");

    await save(articles)
    
    console.log("data updated!");

    res.sendStatus(200);
  });

});