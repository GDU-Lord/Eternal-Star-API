import { parse } from 'node-html-parser';
import Element from './element.js';
import Block from './block.js';
import Span from './span.js';
import { ParentList } from './utils.js';

type rawJSON = Element[];
export interface ids {
  [key: string]: string; // page id
};

export const parentList = new ParentList;

export function toJSON(data: string) {
  const root = parse(data);
  const body = root.querySelector("body");
  const elements = body?.querySelectorAll("p, h1, h2, h3, h4, ul")?.filter(e => e.parentNode === body);
  return elements?.map(e => {
    let type = Element.parseType(e);
    return new Element(type, e);
  }) ?? [];
}

export function getParts(json: rawJSON) {
  let parts: Block[] = [];
  for(const e of json) {
    if(e.type === "title") {
      parts.push(new Block(e.spans[0].content, e.id!));
      continue;
    }
    parts[parts.length-1].addElements(e);
  }
  return parts;
}

export function getArticles(part: Block) {
  let articles: Block[] = [];
  element: for(const e of part.elements) {
    if(e.type === "h1") {
      articles.push(new Block(e.spans[0].content, e.id!));
      continue element;
    }
    const article = articles[articles.length-1];
    if(article == null) continue element;
    span: for(const span of e.spans) {
      if(span.type !== "image") continue span;
      if(span.content === "") continue span;
      article.images.push(span.content);
    }
    article.addElements(e);
  }
  return articles;
}

export function indexArticles(blocks: Block[]) {
  const ids: ids = {};

  const links: Span[] = [];

  blocks: for(const block of blocks) {
    if(block.id == null) continue blocks;
    ids[block.id] = block.id;
    elements: for(const e of block.elements) {
      spans: for(const span of e.getNestedSpans()) {
        if(span.type !== "link") continue spans;
        links.push(span);
      }
      if(e.id == null) continue elements;
      ids[e.id] = block.id;
    }
  }

  return {
    links, ids, blocks
  };
}

export function createLinks(links: Span[], ids: ids) {

  for(const link of links) {
    const id = link.data?.slice(1); // get link target id
    if(id == null || id === "") continue;
    const page_id = ids[id]; // get target page id
    if(page_id == null) continue;
    link.data = page_id + link.data;
  }

}