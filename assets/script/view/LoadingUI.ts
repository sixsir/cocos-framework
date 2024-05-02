import { _decorator, Component, Label, Node, ProgressBar } from "cc";
import ResConfig from "../config/ResConfig";
import ResMgr from "../framework/ResMgr";
import EventMgr from "../framework/EventMgr";
const { ccclass, property } = _decorator;

@ccclass("LoadingUI")
export class LoadingUI extends Component {
  @property(ProgressBar)
  public progressBar: ProgressBar = null;
  @property(Label)
  public label: Label = null;

  private targetProgress: number = 0;

  protected onLoad(): void {
    this.progressBar.progress = 0;
  }

  start() {
    const endFunc = () => {};

    const progressFunc = (cur, total) => {
      console.log("🚀 ~ LoadingUI ~ progress:", cur, total);
      this.targetProgress = cur / total; // 设置目标进度值
    };

    ResMgr.ins.preLoad(ResConfig.resList, endFunc, progressFunc);
  }

  update(deltaTime: number) {
    if (this.progressBar.progress < this.targetProgress) {
      // 计算增加的进度，确保它不会超过目标进度
      const progressStep = deltaTime / 5.5; // 以0.5秒完成动画为目标
      this.progressBar.progress = Math.min(
        this.progressBar.progress + progressStep,
        this.targetProgress
      );

      this.label.string = Math.floor(this.progressBar.progress * 100) + "%";
    } else if (this.progressBar.progress >= 1) {
      EventMgr.ins.emit("res_load_complete");
      this.node.destroy();
    }
  }
}
