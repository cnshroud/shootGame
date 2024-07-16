import { _decorator, Component, EventTouch, Input, input, UITransform, Vec2, Node, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('joyStickManager')
export class joyStickManager extends Component {

    //公有字段，用于给外界访问
    input: Vec2 = Vec2.ZERO

    //监听用户输入模块，直接从官网的输入事件案例copy下来的

    private body: Node;
    private stick: Node
    //用于保存body的初始位置，因为松开屏幕之后body要返回初始位置
    private defaultPos: Vec2
    //body半径
    private radius: number;
    onLoad() {
        //获取节点
        this.body = this.node.getChildByName("Body");
        this.stick = this.body.getChildByName("Stick");
        this.radius = this.body.getComponent(UITransform).contentSize.x / 2;
        //获取初始位置，Vec2对象，表示物体的当前位置
        this.defaultPos = new Vec2(this.body.position.x, this.body.position.y);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }


    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }
    //点击屏幕时body出现在点击的位置
    onTouchStart(event: EventTouch) {
        //保存点击位置的坐标
        //event.getLocation() 方法用于获取当前触摸事件的位置信息，返回一个包含 x 和 y 坐标的对象
        const touchPos = event.getUILocation();
        this.body.setPosition(touchPos.x, touchPos.y);
    }
    //触摸结束后body和stick返回原来位置
    onTouchEnd() {
        this.body.setPosition(this.defaultPos.x, this.defaultPos.y);
        this.stick.setPosition(0, 0);

        this.input = Vec2.ZERO
    }
    //
    onTouchMove(event: EventTouch) {
        //getUILocation()方法用于获取用户在屏幕上的触摸位置。
        const touchPos = event.getUILocation()

        const stickPos = new Vec2(touchPos.x - this.body.position.x, touchPos.y - this.body.position.y)
        //将stickPos限制在半径内
        if (stickPos.length() > this.radius) {
            //如果大于半径，那么使用stickPos.multiplyScalar(this.radius / stickPos.length())将向量乘以一个缩放因子，使其长度等于半径。
            stickPos.multiplyScalar(this.radius / stickPos.length())
        }
        this.stick.setPosition(stickPos.x, stickPos.y);

        //归一化，normalize()方法用于将向量归一化，使其长度为1。
        this.input = stickPos.clone().normalize()
        // log(this.input)
    }
}

