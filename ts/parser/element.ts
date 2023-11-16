import { HTMLElement } from "node-html-parser";
import Span from "./span.js";
import { getLevel, withId } from "./utils.js";
import Block from "./block.js";
import { parentList } from "./index.js";
import { ObjectId } from "mongodb";

export default class Element extends withId {

  static parseType(e: HTMLElement): Element["type"] {
    if(e.classList.contains("title"))
      return "title";
    if(e.classList.contains("subtitle"))
      return "subtitle";
    if(e.rawTagName === "h1")
      return "h1";
    if(e.rawTagName === "h2")
      return "h2";
    if(e.rawTagName === "h3")
      return "h3";
    if(e.rawTagName === "h4")
      return "h4";
    if(e.rawTagName === "ul")
      return "list";
    if(e.rawTagName === "p")
      return "text";
    return console.error("unexpected element", e) as any ?? "error";
  }

  spans: Span[] = [];
  list: Element[] = [];
  level: number = 0;
  id?: string;

  constructor(
    public type: "title" | "subtitle" | `h${1|2|3|4}` | "text" | "list" | "error",
    e: HTMLElement,
    parent: Element | Block | null = null
  ) {
    super();

    parentList.setParent(this, parent);

    if(this.type === "error") return;
    
    this.id = e.id;

    if(this.type === "list") {
      for(const name of e.classList.values()) {
        const level = getLevel(name);
        if(!isNaN(level)) {
          this.level = level;
          break;
        }
      }
      this.list = e.querySelectorAll("li").map(e => {
        return new Element("text", e, this);
      });
      return;
    }

    this.spans = e.querySelectorAll("span").map(span => {
      return new Span(span, this);
    });
  }

  getNestedSpans() {
    const spans = [...this.spans];
    for(const e of this.list) {
      spans.push(...e.getNestedSpans());
    }
    return spans;
  }

}