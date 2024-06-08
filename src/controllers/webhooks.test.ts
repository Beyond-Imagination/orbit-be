import { getMockReq, getMockRes } from '@jest-mock/express'
import { faker } from '@faker-js/faker'

import { install, uninstall, updateServerUrl } from '@/controllers/webhooks'
import { OrganizationSecret } from '@/models/organization'

const createMock = jest.fn().mockReturnValue(Promise.resolve(true))
const updateServerUrlByClientIdMock = jest.fn().mockReturnValue(Promise.resolve(true))
const deleteByClientIdMock = jest.fn().mockReturnValue(Promise.resolve(true))
jest.mock('@/models', () => {
    return {
        OrganizationModel: {
            create: jest.fn().mockImplementation((...args) => createMock(...args)),
            updateServerUrlByClientId: jest.fn().mockImplementation((...args) => updateServerUrlByClientIdMock(...args)),
            deleteByClientId: jest.fn().mockImplementation((...args) => deleteByClientIdMock(...args)),
        },
    }
})

const getApplicationMock = jest.fn().mockReturnValue(Promise.resolve(true))
const syncMock = jest.fn().mockReturnValue(Promise.resolve(true))
jest.mock('@/libs/space', () => ({
    getApplication: jest.fn().mockImplementation((...args) => getApplicationMock(...args)),
    sync: jest.fn().mockImplementation((...args) => syncMock(...args)),
}))

describe('install', () => {
    it('should success', async () => {
        const secret = new OrganizationSecret('clientId', 'clientSecret', 'serverUrl')
        const body = {
            clientId: faker.string.uuid(),
            newServerUrl: faker.internet.url(),
        }
        const req = getMockReq({ body: body, organizationSecret: secret })
        const { res } = getMockRes({})

        await install(req, res)

        expect(getApplicationMock).toHaveBeenCalledWith(secret)
        expect(syncMock).toHaveBeenCalledWith(secret, expect.anything())
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.send).toHaveBeenCalledTimes(1)
    })
})

describe('updateServerUrl', () => {
    it('should success', async () => {
        const body = {
            clientId: faker.string.uuid(),
            newServerUrl: faker.internet.url(),
        }
        const req = getMockReq({ body: body })
        const { res } = getMockRes({})

        await updateServerUrl(req, res)

        expect(updateServerUrlByClientIdMock).toHaveBeenCalledWith(body.clientId, body.newServerUrl)
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.send).toHaveBeenCalledTimes(1)
    })
})

describe('uninstall', () => {
    it('should success', async () => {
        const body = {
            clientId: faker.string.uuid(),
        }
        const req = getMockReq({ body: body })
        const { res } = getMockRes({})

        await uninstall(req, res)

        expect(deleteByClientIdMock).toHaveBeenCalledWith(body.clientId)
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.send).toHaveBeenCalledTimes(1)
    })
})
