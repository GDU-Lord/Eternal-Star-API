import Element from "./element.js";
import { parentList } from "./index.js";
import { withId } from "./utils.js";

export default class Block extends withId {
  
  elements: Element[] = [];
  images: string[] = [];

  constructor(
    public title: string,
    public id: string,
  ) {
    super();
  }

  addElements(...elements: Element[]) {
    this.elements.push(...elements);
    for(const e of elements)
      parentList.setParent(e, this);
  }

}