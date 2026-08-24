import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  Collider,
  Label,
  director,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("player")
export class player extends Component {
  // 摄像机组件
  @property(Node)
  C_Node: Node = null;

  // 赛车组件
  @property(Collider)
  Car_Collider: Collider = null;

  // 提示框组件
  @property(Node)
  Tips_Node: Node = null;

  // 提示框文本组件
  @property(Label)
  Tips_Label: Label = null;

  @property
  PlayerSpeed: number = 30;
  PlayerMove = {
    a: false,
    d: false,
  };
  Move = true;

  protected onLoad(): void {
    console.log("player onLoad");

    this.Tips_Node.active = false; // 节点隐藏

    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

    this.Car_Collider.on("onTriggerEnter", this.Start_Collider, this);
  }

  protected onDestroy(): void {
    console.log("player onDestroy");
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.off(Input.EventType.KEY_UP, this.onKeyUp, this);

    this.Car_Collider.off("onTriggerEnter", this.Start_Collider, this);
  }

  Start_Collider(C) {
    this.Tips_Node.active = true; // 节点显示
    this.Move = false; // 关闭移动开关


    if (C.otherCollider.node.name === "End") {
      console.log("游戏成功");
      this.Tips_Label.string = "成功了！";
    } else {
      console.log("游戏失败");
      this.Tips_Label.string = "失败了！";
    }
  }

  Restart_Game() {
    director.loadScene("x1"); // 重新加载场景
  }

  onKeyDown(key) {
    if (key.keyCode === 65) {
      this.PlayerMove.a = true;
    } else if (key.keyCode === 68) {
      this.PlayerMove.d = true;
    }
  }

  onKeyUp(key) {
    if (key.keyCode === 65) {
      this.PlayerMove.a = false;
    } else if (key.keyCode === 68) {
      this.PlayerMove.d = false;
    }
  }
  // 生命周期函数
  start() {
    console.log("player start");
  }

  update(deltaTime: number) {
    // console.log("player update", deltaTime);
    if (!this.Move) return;
    // 更改小车z
    const P_Node = this.node;
    const P_Pos = P_Node.getPosition();
    const C_Node = this.C_Node;
    const Speed = this.PlayerSpeed * deltaTime;
    const z = P_Pos.z - Speed;

    // 控制小车左右
    if (this.PlayerMove.a && !this.PlayerMove.d) {
      P_Pos.x -= Speed;
    } else if (!this.PlayerMove.a && this.PlayerMove.d) {
      P_Pos.x += Speed;
    }

    P_Pos.x = Math.max(Math.min(P_Pos.x, 3.55), -3.55); // 判断 范围

    // 更改相机节点z
    const C_Pos = C_Node.getPosition();
    const C_z = C_Pos.z - Speed;

    this.node.setPosition(P_Pos.x, P_Pos.y, z);

    C_Node.setPosition(C_Pos.x, C_Pos.y, C_z);
  }
}
