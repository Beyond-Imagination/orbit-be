import { DeleteResult, UpdateResult } from 'mongodb'
import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { getModelForClass, plugin, prop, Ref, ReturnModelType } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import cronParser from 'cron-parser'

import { Organization } from '@models/organization'

@plugin(mongoosePaginate)
export class Orbit extends TimeStamps {
    static paginate: mongoose.PaginateModel<typeof Orbit>['paginate']

    public _id: mongoose.Types.ObjectId

    @prop({ ref: 'Organization' })
    public organization: Ref<Organization>

    @prop({ required: true, index: true })
    public clientId: string

    @prop({ required: true })
    public channelName: string

    @prop({ default: 'cron' })
    public format: string

    @prop({ required: true })
    public message: string

    @prop({ required: true })
    public cron: string

    @prop({ default: 'Etc/UTC' })
    public timezone: string

    @prop()
    public authorId: string

    @prop({ index: true })
    public nextExecutionTime: Date

    @prop({ default: 'scheduled' })
    public status: string

    public static async findById(this: ReturnModelType<typeof Orbit>, id: string): Promise<Orbit> {
        return await this.findOne({ _id: id }).exec()
    }

    public static async findByClientId(this: ReturnModelType<typeof Orbit>, clientId: string): Promise<Orbit[]> {
        return await this.find({ clientId }).exec()
    }

    // nextExecutionTime 이 현재시간보다 과거인 애들 read
    public static async findByExecutionTime(
        this: ReturnModelType<typeof Orbit>,
        page: number,
        executionTime: Date = new Date(),
    ): Promise<mongoose.PaginateResult<mongoose.PaginateDocument<typeof Orbit, object, { limit: number }>>> {
        return await this.paginate({ nextExecutionTime: { $lte: executionTime } }, { limit: 200, page: page, populate: 'organization' })
    }

    // 현재 object 의 nextExecutionTime 업데이트
    public async updateNextExecutionTime(): Promise<UpdateResult> {
        const options = { tz: this.timezone }
        const next = cronParser.parseExpression(this.cron, options).next()
        return await OrbitModel.updateOne({ _id: this._id }, { nextExecutionTime: next }).exec()
    }

    // 메세지를 보낸 orbit의 status 업데이트
    public async updateStatus(success: boolean): Promise<UpdateResult> {
        const status = success ? 'success' : 'fail'
        return await OrbitModel.updateOne({ _id: this._id }, { status: status }).exec()
    }

    // _id 로 삭제
    public static async deleteById(this: ReturnModelType<typeof Orbit>, id: string): Promise<DeleteResult> {
        return this.deleteOne({ _id: id })
    }

    public toJSON(): object {
        return {
            _id: this._id,
            clientId: this.clientId,
            channelName: this.channelName,
            format: this.format,
            message: this.message,
            cron: this.cron,
            timezone: this.timezone,
            authorId: this.authorId,
            nextExecutionTime: this.nextExecutionTime,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            status: this.status,
        }
    }
}

export const OrbitModel = getModelForClass(Orbit)
