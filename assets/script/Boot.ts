import { _decorator, Component, director, find } from "cc";
import GameMgr from "./framework/GameMgr";
import UIMgr from "./framework/UIMgr";
import { AudioMgr } from "./framework/AudioMgr";
const { ccclass } = _decorator;

@ccclass("Boot")
export class Boot extends Component {
  onLoad() {
    // 标记为常驻节点，这样场景切换的时候就不会被销毁了
    director.addPersistRootNode(this.node);
    //初始化框架各个模块
    this.node.addComponent(GameMgr);
    AudioMgr.ins.init(this.node);

    const canvas = find("Canvas");
    UIMgr.ins.init(canvas);
  }
}
