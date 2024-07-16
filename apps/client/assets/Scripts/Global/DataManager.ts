import Singleton from "../Base/Singleton";
import { IActorMove, IState } from "../Common";
import { joyStickManager } from "../UI/joyStickManager";
//这是个常量速度
const ACTOR_SPEED = 100

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  jm: joyStickManager


  //IState是前后端通用的类型，所以写在common文件夹下
  state: IState = {
    //角色数组，因为之后会创建很多角色
    actors: [{
      id: 1,
      position: {
        x: 0,
        y: 0
      },
      direction: {
        x: 1,
        y: 0
      }
    }]
  }

  applyInput(input: IActorMove) {
    //根据传入的input修改state
    //先从input中结构出需要的信息
    const {
      id,
      dt,
      //方向
      direction: { x, y },
    } = input

    //根据解构出的id找到actor
    const actor = this.state.actors.find((e) => e.id === id)
    actor.direction.x = x
    actor.direction.y = y
    //位置是方向*时间*速度
    actor.position.x += x * dt * ACTOR_SPEED
    actor.position.y += y * dt * ACTOR_SPEED
  }

}
