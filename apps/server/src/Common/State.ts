
//这些是前后端通用的类型，所以写在common文件夹下

import { InputTypeEnum } from "./Enum"


export interface IVec2 {
    x: number,
    y: number
}

export interface IActor {
    id: number,
    position: IVec2,
    direction: IVec2
}

export interface IState {
    actors: IActor[]
}

export interface IActorMove {
    //玩家id
    id: number,
    //input类型
    type: InputTypeEnum
    //摇杆的方向
    direction: IVec2,
    dt: number,
}