import mongoose from 'mongoose'
import cronParser from 'cron-parser'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { faker } from '@faker-js/faker'

import { Organization } from '@/models/organization'
import { createOrbit, deleteOrbit, getOrbits, sendOrbitMessage, updateOrbit } from '@/controllers/orbits'
import { InvalidOrbitId } from '@/types/errors'

const createMock = jest.fn().mockReturnValue(Promise.resolve(true))
const findByIdMock = jest.fn().mockReturnValue(Promise.resolve(true))
const findByClientIdMock = jest.fn().mockReturnValue(Promise.resolve(true))
const findOneAndUpdateMock = jest.fn().mockReturnValue(Promise.resolve(true))
const deleteByIdMock = jest.fn().mockReturnValue(Promise.resolve(true))
jest.mock('@/models', () => {
    return {
        OrbitModel: {
            create: jest.fn().mockImplementation((...args) => createMock(...args)),
            findById: jest.fn().mockImplementation((...args) => findByIdMock(...args)),
            findByClientId: jest.fn().mockImplementation((...args) => findByClientIdMock(...args)),
            findOneAndUpdate: jest.fn().mockImplementation((...args) => findOneAndUpdateMock(...args)),
            deleteById: jest.fn().mockImplementation((...args) => deleteByIdMock(...args)),
        },
    }
})

const sendChannelMessageMock = jest.fn().mockReturnValue(Promise.resolve(true))
jest.mock('@/libs/space', () => ({
    sendChannelMessage: jest.fn().mockImplementation((...args) => sendChannelMessageMock(...args)),
}))

describe('getOrbits', () => {
    const organization = new Organization()
    organization.clientId = faker.string.uuid()

    it('should success', async () => {
        const req = getMockReq({ organization: organization })
        const { res } = getMockRes({})

        await getOrbits(req, res)

        expect(findByClientIdMock).toHaveBeenCalledWith(organization.clientId)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledTimes(1)
    })

    it('should throw error when db read fails', async () => {
        const req = getMockReq({ organization: organization })
        const { res } = getMockRes({})

        const error = new Error()
        findByClientIdMock.mockRejectedValueOnce(error)

        await expect(getOrbits(req, res)).rejects.toThrowError(error)
    })
})

describe('createOrbit', () => {
    const organization = new Organization()
    organization._id = faker.database.mongodbObjectId() as unknown as mongoose.Types.ObjectId
    organization.clientId = faker.string.uuid()
    const user = {
        id: faker.string.uuid(),
    }
    const body = {
        channelName: faker.string.uuid(),
        type: faker.string.uuid(),
        message: faker.lorem.sentence(),
        cron: faker.system.cron(),
        timezone: faker.location.timeZone(),
    }

    it('should success', async () => {
        const req = getMockReq({ body: body, organization: organization, user: user })
        const { res } = getMockRes({})

        await createOrbit(req, res)

        expect(createMock).toHaveBeenCalledWith({
            organization: organization._id,
            clientId: organization.clientId,
            authorId: user.id,
            channelName: body.channelName,
            type: body.type,
            message: body.message,
            cron: body.cron,
            timezone: body.timezone,
            nextExecutionTime: cronParser
                .parseExpression(body.cron, {
                    tz: req.body.timezone,
                })
                .next(),
            status: 'scheduled',
        })
        expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('should throw error when create fails', async () => {
        const req = getMockReq({ body: body, organization: organization, user: user })
        const { res } = getMockRes({})

        const error = new Error()
        createMock.mockRejectedValueOnce(error)

        await expect(createOrbit(req, res)).rejects.toThrowError(error)
    })
})

describe('updateOrbit', () => {
    const organization = new Organization()
    organization._id = faker.database.mongodbObjectId() as unknown as mongoose.Types.ObjectId
    organization.clientId = faker.string.uuid()
    const user = {
        id: faker.string.uuid(),
    }
    const body = {
        channelName: faker.string.uuid(),
        type: faker.string.uuid(),
        message: faker.lorem.sentence(),
        cron: faker.system.cron(),
        timezone: faker.location.timeZone(),
    }
    const params = {
        id: faker.string.uuid(),
    }

    it('should success', async () => {
        const req = getMockReq({ params: params, body: body, organization: organization, user: user })
        const { res } = getMockRes({})

        await updateOrbit(req, res)

        expect(findOneAndUpdateMock).toHaveBeenCalledWith(
            { _id: req.params.id },
            {
                channelName: body.channelName,
                type: body.type,
                message: body.message,
                cron: body.cron,
                timezone: body.timezone,
                nextExecutionTime: cronParser.parseExpression(body.cron, { tz: body.timezone }).next().toDate(),
                status: 'scheduled',
            },
        )
        expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('should throw error when update fails', async () => {
        const req = getMockReq({ params: { id: faker.string.uuid() }, body: body, organization: organization, user: user })
        const { res } = getMockRes({})

        const error = new Error()
        findOneAndUpdateMock.mockRejectedValueOnce(error)

        await expect(updateOrbit(req, res)).rejects.toThrowError(error)
    })
})

describe('deleteOrbit', () => {
    const params = {
        id: faker.string.uuid(),
    }

    it('should success', async () => {
        const req = getMockReq({ params: params })
        const { res } = getMockRes({})

        await deleteOrbit(req, res)

        expect(deleteByIdMock).toHaveBeenCalledWith(req.params.id)
        expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('should throw error when delete fails', async () => {
        const req = getMockReq({ params: params })
        const { res } = getMockRes({})

        const error = new Error()
        deleteByIdMock.mockRejectedValueOnce(error)

        await expect(deleteOrbit(req, res)).rejects.toThrowError(error)
    })

    it('should throw InvalidOrbitId error when no orbit deleted', async () => {
        const req = getMockReq({ params: params })
        const { res } = getMockRes({})

        deleteByIdMock.mockResolvedValue({
            deletedCount: 0,
        })

        await expect(deleteOrbit(req, res)).rejects.toThrowError(InvalidOrbitId)
    })
})

describe('sendOrbitMessage', () => {
    const params = {
        id: faker.string.uuid(),
    }
    const organization = new Organization()
    const orbit = {
        channelName: faker.string.uuid(),
        message: faker.lorem.sentence(),
    }

    it('should success', async () => {
        const req = getMockReq({ params: params, organization: organization })
        const { res } = getMockRes({})

        findByIdMock.mockResolvedValue(orbit)

        await sendOrbitMessage(req, res)

        expect(findByIdMock).toHaveBeenCalledWith(req.params.id)
        expect(sendChannelMessageMock).toHaveBeenCalledWith(organization, orbit.channelName, orbit.message, false)
        expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('should throw error when send message fail', async () => {
        const req = getMockReq({ params: params })
        const { res } = getMockRes({})

        const error = new Error()
        sendChannelMessageMock.mockRejectedValueOnce(error)

        await expect(sendOrbitMessage(req, res)).rejects.toThrowError(error)
    })
})
