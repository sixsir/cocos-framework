import { _decorator, Component, find } from "cc";
import GameMgr from "./framework/GameMgr";
import UIMgr from "./framework/UIMgr";
const { ccclass } = _decorator;

@ccclass("Boot")
export class Boot extends Component {
  onLoad() {
    //初始化框架各个模块
    this.node.addComponent(GameMgr);

    const canvas = find("Canvas");
    UIMgr.ins.init(canvas);
  }
}
