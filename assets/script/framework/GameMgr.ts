import { Component } from "cc";
import EventMgr from "./EventMgr";
import UIMgr from "./UIMgr";

export default class GameMgr extends Component {
  private static _instance: GameMgr = null;

  public static get ins(): GameMgr {
    return this._instance;
  }

  protected onLoad(): void {
    if (GameMgr._instance == null) {
      GameMgr._instance = this;
    } else {
      this.node.destroy();
    }
  }

  private onResLoadComplete() {
    console.log("🚀 ~ GameMgr ~ onResLoadComplete");
    UIMgr.ins.show("GameUI");
  }

  protected start(): void {
    EventMgr.ins.on("res_load_complete", this.onResLoadComplete, this);
  }
}
