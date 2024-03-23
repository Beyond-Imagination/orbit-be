import { DeleteResult } from 'mongodb'
import mongoose from 'mongoose'
import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

import { OrganizationNotFoundException } from '@/types/errors'
import { IOrganizationSecret } from '@/types/space'
import { getBearerToken } from '@/services/space'

export class OrganizationSecret implements IOrganizationSecret {
    clientId: string
    clientSecret: string
    serverUrl: string

    constructor(clientId: string, clientSecret: string, serverUrl: string) {
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.serverUrl = serverUrl
    }

    public async getBearerToken(): Promise<string> {
        return getBearerToken(this)
    }
}

export class Organization extends TimeStamps implements IOrganizationSecret {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true, unique: true })
    public clientId: string

    @prop({ required: true })
    public clientSecret: string

    @prop({ required: true, index: true })
    public serverUrl: string

    @prop({ type: String })
    public admin: string[]

    @prop()
    public version: string

    @prop()
    public createdAt: Date

    public static async findByServerUrl(this: ReturnModelType<typeof Organization>, serverUrl: string): Promise<Organization> {
        return this.findByFilter({ serverUrl })
    }

    public static async findByClientId(this: ReturnModelType<typeof Organization>, clientId: string): Promise<Organization> {
        return this.findByFilter({ clientId })
    }

    private static async findByFilter(this: ReturnModelType<typeof Organization>, filter: object): Promise<Organization> {
        const organization = await this.findOne(filter).exec()
        if (organization) {
            return organization
        } else {
            throw new OrganizationNotFoundException()
        }
    }

    public static async deleteByClientId(this: ReturnModelType<typeof Organization>, clientId: string): Promise<DeleteResult> {
        return this.deleteOne({ clientId: clientId })
    }

    public static async updateServerUrlByClientId(this: ReturnModelType<typeof Organization>, clientId: string, newServerUrl: string): Promise<void> {
        await this.findOneAndUpdate({ clientId: clientId }, { serverUrl: newServerUrl })
    }

    public async getBearerToken(): Promise<string> {
        return getBearerToken(this)
    }
}

export const OrganizationModel = getModelForClass(Organization)
