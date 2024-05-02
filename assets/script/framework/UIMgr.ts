import { Node, instantiate } from "cc";
import ResMgr from "./ResMgr";
import UIConfig from "../config/UIConfig";

export default class UIMgr {
  private static _instance: UIMgr = null;
  private canvas: Node = null;
  private uiMap = {};

  public static get ins(): UIMgr {
    if (this._instance == null) {
      this._instance = new UIMgr();
    }
    return this._instance;
  }

  init(canvas: Node) {
    this.canvas = canvas;
  }

  show(uiName: string, parent?: Node) {
    if (!parent) {
      parent = this.canvas;
    }

    let item: Node = this.uiMap[uiName];
    if (!item) {
      const prefab = ResMgr.ins.getAsset("ui", "prefab/" + uiName);
      if (prefab) {
        item = instantiate(prefab);
        item.addComponent(UIConfig.uiMap[uiName]);

        this.uiMap[uiName] = item;
      }
    }

    if (!item) {
      return;
    }

    parent.addChild(item);
  }

  hide(uiName: string, destroy: boolean = true) {
    let item: Node = this.uiMap[uiName];
    if (item) {
      item.removeFromParent();
      if (destroy) {
        item.destroy();
        this.uiMap[uiName] = null;
      }
    }
  }
}
