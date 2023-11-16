import { ObjectId } from "mongodb";

export function getLevel(name: string) {
  return Number(name.match(/(?<=([a-z0-9]|\-){1,}\-)[0-9]$/)?.[0]);
}

export class withId {
  _id: ObjectId;
  constructor() {
    this._id = new ObjectId;
  }
}

export class ParentList {

  map: Map<ObjectId, withId>;

  constructor() {
    this.map = new Map();
  }

  getParent(object: withId) {
    return this.map.get(object._id);
  }

  setParent(object: withId, parent: withId | null = null) {
    if(parent == null) return;
    this.map.set(object._id, parent);
  }

  getTopParent<type extends withId>(object: withId): type {
    const parent = this.getParent(object);
    if(parent == null) return object as type;
    console.log("FOUND PARENT");
    return this.getTopParent<type>(parent);
  }

  clear() {
    this.map.clear();
  }

}