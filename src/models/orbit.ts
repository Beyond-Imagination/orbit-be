import { DeleteResult, UpdateResult } from 'mongodb'
import mongoose from 'mongoose'
import { getModelForClass, prop, Ref, ReturnModelType } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import cronParser from 'cron-parser'

import { Organization } from '@models/organization'

export class Orbit extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop({ ref: 'Organization' })
    public organization: Ref<Organization>

    @prop({ required: true, index: true })
    public clientId: string

    @prop({ required: true })
    public channelName: string

    @prop({ required: true })
    public message: string

    @prop({ required: true })
    public cron: string

    @prop()
    public authorId: string

    @prop({ index: true })
    public nextExecutionTime: Date

    public static async findByClientId(this: ReturnModelType<typeof Orbit>, clientId: string): Promise<Orbit[]> {
        return await this.find({ clientId }).exec()
    }

    // nextExecutionTime 이 현재시간보다 과거인 애들 read
    public static async findByExecutionTime(this: ReturnModelType<typeof Orbit>, executionTime: Date = new Date()): Promise<Orbit[]> {
        return this.find({ nextExecutionTime: { $lte: executionTime } })
            .populate('organization')
            .exec()
    }

    // 현재 object 의 nextExecutionTime 업데이트
    public async updateNextExecutionTime(): Promise<UpdateResult> {
        const next = cronParser.parseExpression(this.cron).next()
        return await OrbitModel.updateOne({ _id: this._id }, { nextExecutionTime: next }).exec()
    }

    // _id 로 삭제
    public static async deleteById(this: ReturnModelType<typeof Orbit>, id: string): Promise<DeleteResult> {
        return this.deleteOne({ _id: id })
    }
}

export const OrbitModel = getModelForClass(Orbit)
