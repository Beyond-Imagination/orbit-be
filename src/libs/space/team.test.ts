import fetchMockJest from 'fetch-mock-jest'
import fetch from 'node-fetch'
import { faker } from '@faker-js/faker'

import { OrganizationSecret } from '@/models'
import { Profile } from '@/types/space'
import { Unauthorized } from '@/types/errors'
import { getUserProfile } from '@/libs/space/team'

jest.mock('node-fetch', () => fetchMockJest.sandbox())

describe('getUserProfile', () => {
    const fetchMock: any = fetch
    const token = faker.string.uuid()
    const secret = new OrganizationSecret(faker.string.uuid(), faker.string.uuid(), faker.internet.url({ appendSlash: false }))
    const url = `${secret.serverUrl}/api/http/team-directory/profiles/me`

    afterEach(() => {
        fetchMock.mockReset()
    })

    it('should success', async () => {
        const profile: Profile = {
            id: faker.string.nanoid(10),
            username: faker.person.middleName(),
            name: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
            },
            smallAvatar: faker.string.nanoid(10),
            avatar: faker.string.nanoid(10),
            profilePicture: faker.string.nanoid(10),
        }

        fetchMock.get(url, profile)

        const result = await getUserProfile(token, secret)
        expect(result).toEqual(profile)
        expect(fetchMock).toHaveLastFetched(url, {
            method: 'GET',
            headers: {
                Authorization: token,
            },
        })
    })

    it('should throw unauthorized error when fail', async () => {
        const mockResponse = {
            status: 500,
            body: 'Internal error',
        }
        fetchMock.get(url, mockResponse)

        await expect(getUserProfile(token, secret)).rejects.toThrowError(Unauthorized)
    })
})
