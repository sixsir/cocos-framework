import { EventTarget } from "cc";

export default class EventMgr {
  private static _instance: EventTarget = null;

  public static get ins(): EventTarget {
    if (this._instance == null) {
      this._instance = new EventTarget();
    }
    return this._instance;
  }
}
