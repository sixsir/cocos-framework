import { AudioClip, AudioSource, Component, Node, assetManager, resources } from "cc";

type AudioMap = {
  [key: string]: AudioClip;
};

export class AudioMgr {
  private static _instance: AudioMgr = null;

  public static get ins(): AudioMgr {
    if (this._instance == null) {
      this._instance = new AudioMgr();
    }
    return this._instance;
  }

  private audioMap: AudioMap = {};
  /**背景音乐 */
  private musicSource: AudioSource = null;
  /**音效 */
  private soundSource: AudioSource = null;

  init(rootNode: Node) {
    // 创建一个节点作为 audioMgr
    let audioMgr = new Node();
    audioMgr.name = "__audioMgr__";

    // 添加节点到场景
    rootNode.addChild(audioMgr);

    // 添加 AudioSource 组件，用于播放音频。
    this.musicSource = audioMgr.addComponent(AudioSource);
    this.musicSource.loop = true;

    this.soundSource = audioMgr.addComponent(AudioSource);
  }

  /**
   * 播放短音频,比如 打击音效，爆炸音效等
   * @param audioPath clip 的路径
   * @param volume 音量
   */
  playOneShot(audioPath: string, volume: number = 1.0) {
    const audioClip = this.audioMap[audioPath];

    if (audioClip) {
      this.soundSource.playOneShot(audioClip, volume);
    } else {
      resources.load(audioPath, (err, clip: AudioClip) => {
        if (err) {
          console.warn(err);
        } else {
          this.audioMap[audioPath] = clip;
          this.soundSource.playOneShot(clip, volume);
        }
      });
    }
  }

  /**
   * @en
   * play long audio, such as the bg music
   * @zh
   * 播放长音频，比如 背景音乐
   * @param audioPath clip or url for the sound
   * @param volume
   */
  play(audioPath: string, volume: number = 1.0) {
    const audioClip = this.audioMap[audioPath];
    if (audioClip) {
      this.musicSource.stop();
      this.musicSource.clip = audioClip;
      this.musicSource.play();
      this.musicSource.volume = volume;
    } else {
      resources.load(audioPath, (err, clip: AudioClip) => {
        if (err) {
          console.warn(err);
        } else {
          this.audioMap[audioPath] = clip;

          this.musicSource.clip = clip;
          this.musicSource.play();
          this.musicSource.volume = volume;
        }
      });
    }
  }

  stop() {
    this.musicSource.stop();
  }

  pause() {
    this.musicSource.pause();
  }

  resume() {
    this.musicSource.play();
  }
}
