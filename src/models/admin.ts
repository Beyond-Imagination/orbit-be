import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import mongoose from 'mongoose'
import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '@config'
import { AlreadyExistedUsername } from '@/types/errors/admin'

export class Admin extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true, unique: true, maxlength: 20, index: true })
    public username: string

    @prop({ required: true })
    public password: string

    @prop({ default: Date.now() })
    public registeredAt: Date

    @prop({ default: false })
    public hasApproved: boolean

    @prop()
    public approvedAt?: Date

    @prop()
    public lastLoggedIn?: Date

    public static async findByUsername(this: ReturnModelType<typeof Admin>, username: string): Promise<Admin> {
        return await this.findOne({ username }).exec()
    }

    public static async saveAdmin(this: ReturnModelType<typeof Admin>, username: string, password: string, name: string): Promise<void> {
        const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS)
        try {
            await AdminModel.create({ username: username, password: hashedPassword, name: name })
        } catch (e) {
            if (e.code === 11000) throw new AlreadyExistedUsername()
            else throw e
        }
    }
    // todo: 추후 approve/reject 사항 반영 시, hasApproved, approvedAt 업데이트 함수 정의
}

export const AdminModel = getModelForClass(Admin)
