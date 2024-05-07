import { Asset, AssetManager, Prefab, assetManager } from "cc";
import { ResParams } from "../define/Game";

export default class ResMgr {
  private static _instance: ResMgr = null;
  /**所有预加载好的资源map */
  private assetMap = {};

  private bundleTotalCount: number = 0;
  private assetTotalCount: number = 0;

  /**总共需要加载的资源数量 bundle+prefab+audio 等等 */
  private loadTotalCount: number = 0;
  private loadCurCount: number = 0;

  private endFunc: Function = null;
  private progressFunc: Function = null;

  public static get ins(): ResMgr {
    if (!this._instance) {
      this._instance = new ResMgr();
    }
    return this._instance;
  }

  getAsset(bundle: string, resPath: string): any {
    return this.assetMap[bundle + resPath];
  }

  getBundle(bundle: string, resPath: string, type = Prefab): any {
    return assetManager.getBundle(bundle).get(resPath, type);
  }

  private loadRes(bundle: AssetManager.Bundle, url: string, assetType?: any) {
    return new Promise<Asset>((resolve, reject) => {
      bundle.load(url, assetType, (err, asset) => {
        if (err) {
          console.log("🚀 ~ ResMgr ~ loadRes ~ err:" + url, err);
          reject(err);
          return;
        }

        resolve(asset);
      });
    });
  }

  public async preLoad(resList: Array<ResParams>, endFunc: Function, progressFunc?: Function) {
    this.assetMap = {};
    this.endFunc = endFunc;
    this.progressFunc = progressFunc;
    this.bundleTotalCount = resList.length;
    this.assetTotalCount = 0;
    this.loadTotalCount = this.bundleTotalCount;
    this.loadCurCount = 0;

    for (let i = 0; i < this.bundleTotalCount; i++) {
      const item = resList[i];
      this.assetTotalCount += item.urls.length;
    }
    this.loadTotalCount += this.assetTotalCount;

    for (let i = 0; i < this.bundleTotalCount; i++) {
      const item = resList[i];
      try {
        const ab = await this.loadBundle(item.bundleName);
        this.loadCurCount++;
        this.progressFunc?.(this.loadCurCount, this.loadTotalCount);

        for (let j = 0; j < item.urls.length; j++) {
          const url = item.urls[j];
          try {
            const asset = await this.loadRes(ab, url, item.assetType);
            this.assetMap[item.bundleName + url] = asset;

            this.loadCurCount++;
            this.progressFunc?.(this.loadCurCount, this.loadTotalCount);
          } catch (error) {
            console.log("🚀 ~ ResMgr ~ url ~ error:" + url, error);
          }
        }

        //加载完成之后卸载资源
        // assetManager.removeBundle(ab);
      } catch (error) {
        console.log("🚀 ~ ResMgr ~ preLoad ~ bundleName:" + item.bundleName, error);
      }
    }

    // console.log(
    //   "🚀 ~ ResMgr ~ loadCurCount:",
    //   this.loadCurCount,
    //   this.loadTotalCount
    // );
    if (this.loadCurCount == this.loadTotalCount) {
      this.endFunc();
    } else {
      console.warn("资源加载失败，请重试");
    }
  }

  public async loadBundle(
    nameOrUrl: string,
    options?: {
      [k: string]: any;
      version?: string;
    }
  ) {
    return new Promise<AssetManager.Bundle>((resolve, reject) => {
      assetManager.loadBundle(nameOrUrl, options, (err: Error, assets: AssetManager.Bundle) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(assets);
      });
    });
  }
}
