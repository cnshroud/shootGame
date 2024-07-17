import { _decorator, Component, EventTouch, Input, input, UITransform, Vec2, Node, log, Prefab, instantiate, toDegree } from 'cc';
import DataManager from '../Global/DataManager';
import { joyStickManager } from '../UI/joyStickManager';
import { ResourceManager } from '../Global/ResourceManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import { PrefabPathEnum } from '../Enum';
import { EntityTypeEnum } from '../Common';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {

    private stage: Node;
    private ui: Node;
    private shouldUpdate = false
    onLoad() {
        //拿到场景中的stage节点和ui节点
        this.stage = this.node.getChildByName('stage');
        this.ui = this.node.getChildByName('UI');
        this.stage.destroyAllChildren()
        DataManager.Instance.jm = this.ui.getComponentInChildren(joyStickManager);
    }
    update(dt) {
        if (!this.shouldUpdate) {
            return
        }
        this.render()
        this.tick(dt)
    }
    tick(dt) {
        this.tickActor(dt)
    }
    tickActor(dt) {
        for (const data of DataManager.Instance.state.actors) {
            const { id, type } = data
            //获取角色数组里的角色id
            let am = DataManager.Instance.actorMap.get(id)
            am.tick(dt)

        }
    }

    async start() {
        await this.loadRes()
        this.initMap()
        //资源加载完把shouldUpdate设为true
        this.shouldUpdate = true
    }
    async loadRes() {
        //加载资源
        const list = []
        for (const type in PrefabPathEnum) {
            //ResourceManager应该是个reseource管理器，用来管理资源
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((prefab) => {
                DataManager.Instance.prefabMap.set(type, prefab)
            })
            list.push(p)
        }
        await Promise.all(list)
    }
    render() {
        //调用角色渲染
        this.renderActor()

    }

    async renderActor() {
        //渲染角色
        for (const data of DataManager.Instance.state.actors) {
            const { id, type } = data
            //获取角色数组里的角色id
            let am = DataManager.Instance.actorMap.get(id)
            if (!am) {
                //资源异步加载
                //render是在update里面执行的，但是update的执行是不会等到异步函数的运用的，所以要在start或者onload中先加载好
                //例如这个资源要两秒才能加载，但是update06ms执行一次，就会导致一致执行这段代码
                const prefab = DataManager.Instance.prefabMap.get(type)
                const actor = instantiate(prefab)
                actor.setParent(this.stage)
                //在预制体中动态加载脚本，这样就不用再预制体中挂载脚本了
                am = actor.addComponent(ActorManager)
                DataManager.Instance.actorMap.set(id, am)
                //初始化,第一次加载要做初始化
                am.init(data)
            } else {
                am.render(data)
            }
        }
    }
    //初始化地图
    initMap() {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Map)
        const actor = instantiate(prefab)
        actor.setParent(this.stage)
    }
}



