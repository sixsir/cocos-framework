import { _decorator, Component, Node } from "cc";

export class BaseUI extends Component {
  protected view = {};

  /**保存所有子节点 到view map，key:节点路径+节点名*/
  private loadAllNode(root: Node, path: string) {
    const length = root.children.length;
    for (let i = 0; i < length; i++) {
      const element = root.children[i];
      this.view[path + element.name] = element;
      this.loadAllNode(element, path + element.name + "/");
    }
  }

  protected onLoad(): void {
    this.view = {};
    this.loadAllNode(this.node, "");
  }

  //   public onClick(viewName: string, callback: Function, caller: Node) {
  //     const node: Node = this.view[viewName];
  //     if (!node) {
  //       return;
  //     }

  //     node.on(NodeEventType.TOUCH_END, callback, caller);
  //   }

  //   public offClick(viewName: string, callback: Function, caller: Node) {
  //     const node: Node = this.view[viewName];
  //     if (!node) {
  //       return;
  //     }

  //     node.off(NodeEventType.TOUCH_END, callback, caller);
  //   }
}
