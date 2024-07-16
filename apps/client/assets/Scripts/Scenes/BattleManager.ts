import { _decorator, Component, EventTouch, Input, input, UITransform, Vec2, Node, log } from 'cc';
import DataManager from '../Global/DataManager';
import { joyStickManager } from '../UI/joyStickManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {

    private stage: Node;
    private ui: Node;
    onLoad() {
        //拿到场景中的stage节点和ui节点
        this.stage = this.node.getChildByName('stage');
        this.ui = this.node.getChildByName('UI');
        DataManager.Instance.jm = this.ui.getComponentInChildren(joyStickManager);
    }



}

