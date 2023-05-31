import { Types } from 'mongoose'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export class Orbit extends TimeStamps {
    public _id: Types.ObjectId

    @prop({ required: true })
    public clientId: string

    @prop({ required: true })
    public channelId: string

    @prop({ required: true })
    public message: string

    @prop({ required: true })
    public cron: string

    @prop()
    public authorId: string

    @prop({ index: true })
    public nextExecutionTime: Date

    // nextExecutionTime 이 현재시간보다 과거인 애들 read
    public static findByExecutionTime() {
        // TODO implement function
    }

    // 현재 object 의 nextExecutionTime 업데이트
    public updateNextExecutionTime() {
        // TODO implement function
    }

    // _id 로 삭제
    public static deleteById() {
        // TODO implement function
    }
}

export const OrbitModel = getModelForClass(Orbit)
