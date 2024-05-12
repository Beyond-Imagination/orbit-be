import { faker } from '@faker-js/faker'
import { getMockReq, getMockRes } from '@jest-mock/express'

import { orbitMaxCountLimiter } from '@/middlewares/orbit'
import { OrbitModel } from '@/models'
import { MAX_ORBIT_COUNT } from '@/config'

const sendAddErrorMessageMock = jest.fn()
jest.mock('@/libs/space', () => ({
    sendAddErrorMessage: jest.fn().mockImplementation((...args) => sendAddErrorMessageMock(...args)),
}))

describe('orbitMaxCountLimiter', () => {
    it('should call error when over max count', async () => {
        const organization = { clientId: faker.string.uuid() }
        const userId = faker.string.alphanumeric(10)
        const req = getMockReq({ organization: organization, body: { userId: userId } })
        const { res, next } = getMockRes({ meta: {} })

        OrbitModel.getCountByClientId = jest.fn().mockReturnValueOnce(MAX_ORBIT_COUNT)

        await orbitMaxCountLimiter(req, res, next)

        expect(sendAddErrorMessageMock).toHaveBeenCalledWith(organization, userId)
        expect(next).toHaveBeenCalledWith(expect.anything())
    })

    it('should pass under max count', async () => {
        const organization = { clientId: faker.string.uuid() }
        const req = getMockReq({ organization: organization })
        const { res, next } = getMockRes({ meta: {} })

        OrbitModel.getCountByClientId = jest.fn().mockReturnValueOnce(MAX_ORBIT_COUNT - 1)

        await orbitMaxCountLimiter(req, res, next)

        expect(next).toHaveBeenCalledWith()
    })
})
