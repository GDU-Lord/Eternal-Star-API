import { HTMLElement } from 'node-html-parser';
import Element from './element.js';
import { parentList } from './index.js';
import { withId } from './utils.js';

export default class Span extends withId {

  content!: string;
  data?: string;
  type!: "text" | "link" | "image";

  constructor(root: HTMLElement, parent: Element) {

    super();

    parentList.setParent(this, parent);

    if(this.parseImage(root)) return;
    if(this.parseLink(root)) return;
    
    this.content = root.innerHTML.replaceAll("&nbsp;", "");
    this.type = "text";
  }

  parseImage(root: HTMLElement) {
    const img = root.querySelector("img");

    if(img == null) return false;

    this.content = img.getAttribute("src") as string;
    this.type = "image";

    return true;
  }

  parseLink(root: HTMLElement) {
    const a = root.querySelector("a");

    if(a == null) return false;

    this.content = a.innerText;
    this.data = a.getAttribute("href") as string;
    this.type = "link";

    return true;
  }
}