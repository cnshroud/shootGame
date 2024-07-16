import { _decorator, Component, EventTouch, Input, input, UITransform, Vec2, Node, log } from 'cc';
import DataManager from '../../Global/DataManager';
import { InputTypeEnum } from '../../Common';
const { ccclass, property } = _decorator;


//用于封装input
@ccclass('ActorManager')
export class ActorManager extends Component {

    onLoad() {

    }
    update(dt) {
        //判断玩家是否在操作摇杆
        if (DataManager.Instance.jm.input.length()) {
            const { x, y } = DataManager.Instance.jm.input;
            DataManager.Instance.applyInput({
                //玩家id
                id: 1,
                //input类型
                type: InputTypeEnum.ActorMove,
                //摇杆的方向
                direction: {
                    x,
                    y,
                },
                dt,
            })
            console.log(DataManager.Instance.state.actors[0].position.x, DataManager.Instance.state.actors[0].position.y);
        }
    }



}

