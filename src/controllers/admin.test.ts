import { faker } from '@faker-js/faker'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { approveAdmin, loginAdmin, logoutAdmin, registerAdmin, updateOrganization } from '@/controllers/admin'
import { Organization } from '@/models'

const approveMock = jest.fn().mockReturnValue(Promise.resolve(true))
const loginMock = jest.fn()
const logoutMock = jest.fn().mockReturnValue(Promise.resolve(true))
const registerMock = jest.fn().mockReturnValue(Promise.resolve(true))
const versionUpdateMock = jest.fn().mockReturnValue(Promise.resolve(true))
jest.mock('@/services/admin', () => {
    return {
        approve: jest.fn().mockImplementation((...args) => approveMock(...args)),
        login: jest.fn().mockImplementation((...args) => loginMock(...args)),
        logout: jest.fn().mockImplementation((...args) => logoutMock(...args)),
        register: jest.fn().mockImplementation((...args) => registerMock(...args)),
        versionUpdate: jest.fn().mockImplementation((...args) => versionUpdateMock(...args)),
    }
})

describe('registerAdmin', () => {
    const body = {
        username: faker.internet.displayName(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
    }

    it('should success', async () => {
        const req = getMockReq({ body: body })
        const { res } = getMockRes({})

        await registerAdmin(req, res)

        expect(registerMock).toHaveBeenCalledWith(body.username, body.password, body.name)
        expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('should throw error when register fail', async () => {
        const req = getMockReq({ body: body })
        const { res } = getMockRes({})

        const error = new Error()
        registerMock.mockRejectedValueOnce(error)

        await expect(registerAdmin(req, res)).rejects.toThrowError(error)
    })
})

describe('loginAdmin', () => {
    const body = {
        username: faker.internet.displayName(),
        password: faker.internet.password(),
    }

    it('should success', async () => {
        const req = getMockReq({ body: body })
        const { res } = getMockRes({})

        const expectedToken = {
            token: faker.string.uuid(),
        }

        loginMock.mockResolvedValue(expectedToken)

        await loginAdmin(req, res)

        expect(loginMock).toHaveBeenCalledWith(body.username, body.password)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expectedToken)
    })

    it('should throw error when login fail', async () => {
        const req = getMockReq({ body: body })
        const { res } = getMockRes({})

        const error = new Error()
        loginMock.mockRejectedValueOnce(error)

        await expect(loginAdmin(req, res)).rejects.toThrowError(error)
    })
})

describe('logoutAdmin', () => {
    const header = {
        authorization: `Bearer ${faker.internet.password()}`,
    }

    it('should success', async () => {
        const req = getMockReq({ header: jest.fn().mockReturnValue(header.authorization) })
        const { res } = getMockRes({})

        await logoutAdmin(req, res)

        expect(logoutMock).toHaveBeenCalledWith(header.authorization)
        expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('should throw error when logout fail', async () => {
        const req = getMockReq({ header: jest.fn().mockReturnValue(header.authorization) })
        const { res } = getMockRes({})

        const error = new Error()
        logoutMock.mockImplementationOnce(() => {
            throw error
        })

        await expect(logoutAdmin(req, res)).rejects.toThrowError(error)
    })
})

describe('approveAdmin', () => {
    const body = {
        username: faker.internet.displayName(),
    }

    it('should success', async () => {
        const req = getMockReq({ body: body })
        const { res } = getMockRes({})

        await approveAdmin(req, res)

        expect(approveMock).toHaveBeenCalledWith(body)
        expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('should throw error when approve fail', async () => {
        const req = getMockReq({ body: body })
        const { res } = getMockRes({})

        const error = new Error()
        approveMock.mockRejectedValueOnce(error)

        await expect(approveAdmin(req, res)).rejects.toThrowError(error)
    })
})

describe('updateOrganization', () => {
    const body = {
        serverUrl: faker.internet.url(),
        version: faker.system.semver(),
    }
    const organization = new Organization()

    it('should success', async () => {
        const req = getMockReq({ body: body, organization: organization })
        const { res } = getMockRes({})

        await updateOrganization(req, res)

        expect(versionUpdateMock).toHaveBeenCalledWith(organization, body.version)
        expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('should throw error when approve fail', async () => {
        const req = getMockReq({ body: body, organization: organization })
        const { res } = getMockRes({})

        const error = new Error()
        versionUpdateMock.mockRejectedValueOnce(error)

        await expect(updateOrganization(req, res)).rejects.toThrowError(error)
    })
})
