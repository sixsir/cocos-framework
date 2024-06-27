import { Node, Prefab, NodePool, instantiate } from "cc";

interface IDictPool {
  [name: string]: NodePool;
}

interface IDictPrefab {
  [name: string]: Prefab;
}

export class PoolMgr {
  public static get ins() {
    if (!this._instance) {
      this._instance = new PoolMgr();
    }

    return this._instance;
  }

  private _dictPool: IDictPool = {};
  private _dictPrefab: IDictPrefab = {};
  private static _instance: PoolMgr;

  public getNode(prefab: Prefab, parent?: Node) {
    let name = prefab.data.name;
    // console.log('get node   ' + name);
    let node: Node = null;
    this._dictPrefab[name] = prefab;
    const pool = this._dictPool[name];
    if (pool) {
      if (pool.size() > 0) {
        node = pool.get();
      } else {
        node = instantiate(prefab);
      }
    } else {
      this._dictPool[name] = new NodePool();
      node = instantiate(prefab);
    }
    if (parent) {
      node.parent = parent;
    }

    node.active = true;
    return node;
  }

  public putNode(node: Node) {
    let name = node.name;
    // console.log('put node   ' + name);
    node.parent = null;
    if (!this._dictPool[name]) {
      this._dictPool[name] = new NodePool();
    }

    this._dictPool[name].put(node);
  }
}
