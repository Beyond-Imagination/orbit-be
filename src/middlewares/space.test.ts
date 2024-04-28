import { OrganizationSecret } from '@/models'

import { getMockReq, getMockRes } from '@jest-mock/express'
import { verifyUserRequest } from '@/middlewares/space'
import { Unauthorized } from '@/types/errors'

const getUserProfileMock = jest.fn()
jest.mock('@/libs/space', () => ({
    getUserProfile: jest.fn().mockImplementation((...args) => getUserProfileMock(...args)),
}))

describe('verifyUser', () => {
    it('success', async () => {
        const secret = new OrganizationSecret('clientId', 'clientSecret', 'serverUrl')
        const req = getMockReq({})
        req.header = jest.fn().mockReturnValueOnce('access_token')
        req.organizationSecret = secret
        const { res, next } = getMockRes({})

        getUserProfileMock.mockReturnValueOnce('user')
        const [, verifyUser] = verifyUserRequest

        await verifyUser(req, res, next)
        expect(req.user).toBe('user')
        expect(getUserProfileMock).toBeCalledWith('access_token', secret)
        expect(next).toBeCalledTimes(1)
    })

    it('error get user profile', async () => {
        const secret = new OrganizationSecret('clientId', 'clientSecret', 'serverUrl')
        const req = getMockReq({})
        req.header = jest.fn().mockReturnValueOnce('access_token')
        req.organizationSecret = secret
        const { res, next } = getMockRes({})

        const error = new Unauthorized('error')
        getUserProfileMock.mockRejectedValueOnce(error)
        const [, verifyUser] = verifyUserRequest
        await expect(verifyUser(req, res, next)).rejects.toThrowError(error)
    })
})
