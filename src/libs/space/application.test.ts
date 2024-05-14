import { faker } from '@faker-js/faker'
import fetchMockJest from 'fetch-mock-jest'
import fetch from 'node-fetch'

import { getAccessToken, getApplication, getPublicKeys } from '@/libs/space/application'
import { OrganizationSecret } from '@/models'
import { ErrorGetApplication, Unauthorized } from '@/types/errors'
import { AccessToken, Application, PublicKeys } from '@/types/space'

jest.mock('node-fetch', () => fetchMockJest.sandbox())

describe('getAccessToken', () => {
    const fetchMock: any = fetch
    const secret = new OrganizationSecret(faker.string.uuid(), faker.string.uuid(), faker.internet.url({ appendSlash: false }))
    const url = `${secret.serverUrl}/oauth/token`

    afterEach(() => {
        fetchMock.mockReset()
    })

    it('should success', async () => {
        const token: AccessToken = {
            token_type: faker.string.alphanumeric(5),
            expires_in: faker.number.int(100),
            access_token: faker.string.uuid(),
            scope: faker.string.alphanumeric(10),
        }

        fetchMock.post(url, token)

        const result = await getAccessToken(secret)
        expect(result).toEqual(token)
    })

    it('should throw unauthorized error when fail', async () => {
        const mockResponse = {
            status: 500,
            body: 'Internal error',
        }
        fetchMock.post(url, mockResponse)

        await expect(getAccessToken(secret)).rejects.toThrowError(Unauthorized)
    })
})

describe('getPublicKeys', () => {
    const fetchMock: any = fetch
    const secret = new OrganizationSecret(faker.string.uuid(), faker.string.uuid(), faker.internet.url({ appendSlash: false }))
    const url = `${secret.serverUrl}/api/http/applications/clientId:${secret.clientId}/public-keys`

    afterEach(() => {
        fetchMock.mockReset()
    })

    it('should success', async () => {
        const keys: PublicKeys = {
            keys: [
                {
                    kty: 'RSA',
                    e: faker.string.alphanumeric(5),
                    n: faker.string.alphanumeric(5),
                },
            ],
        }
        fetchMock.get(url, JSON.stringify(JSON.stringify(keys)))

        const result = await getPublicKeys(secret, faker.string.uuid())
        expect(result).toEqual(keys)
    })

    it('should throw unauthorized error when fail', async () => {
        const mockResponse = {
            status: 500,
            body: 'Internal error',
        }
        fetchMock.get(url, mockResponse)

        await expect(getPublicKeys(secret, faker.string.uuid())).rejects.toThrowError(Unauthorized)
    })
})

describe('getApplication', () => {
    const fetchMock: any = fetch
    const secret = new OrganizationSecret(faker.string.uuid(), faker.string.uuid(), faker.internet.url())
    secret.getBearerToken = jest.fn().mockReturnValue(faker.string.uuid())
    const url = `${secret.serverUrl}/api/http/applications/me`

    afterEach(() => {
        fetchMock.mockReset()
    })

    it('should success', async () => {
        const application: Application = {
            id: faker.string.uuid(),
            name: faker.company.name(),
            clientId: faker.string.uuid(),
        }
        fetchMock.get(url, application)

        const result = await getApplication(secret)
        expect(result).toEqual(application)
    })

    it('should throw ErrorGetApplication error when fail', async () => {
        const mockResponse = {
            status: 500,
            body: 'Internal error',
        }
        fetchMock.get(url, mockResponse)

        await expect(getApplication(secret)).rejects.toThrowError(ErrorGetApplication)
    })
})
