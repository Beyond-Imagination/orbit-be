import fetchMockJest from 'fetch-mock-jest'
import fetch from 'node-fetch'
import { faker } from '@faker-js/faker'

import { OrganizationSecret } from '@/models'
import { ErrorRequestRights, ErrorSetUiExtension } from '@/types/errors'
import { getInstallInfo } from '@/utils/version'
import { requestRights, setUIExtension } from '@/libs/space/install'

jest.mock('node-fetch', () => fetchMockJest.sandbox())

describe('setUIExtension', () => {
    const fetchMock: any = fetch
    const token = faker.string.uuid()
    const secret = new OrganizationSecret(faker.string.uuid(), faker.string.uuid(), faker.internet.url({ appendSlash: false }))
    secret.getBearerToken = jest.fn().mockReturnValue(token)
    const url = `${secret.serverUrl}/api/http/applications/ui-extensions`
    const installInfo = getInstallInfo()

    afterEach(() => {
        fetchMock.mockReset()
    })

    it('should success', async () => {
        fetchMock.patch(url, 204)

        await setUIExtension(secret, installInfo)
        expect(fetchMock).toHaveFetched(url, {
            method: 'PATCH',
            headers: {
                Authorization: token,
            },
            body: installInfo.uiExtension,
        })
    })

    it('should throw ErrorSetUiExtension error when fail', async () => {
        fetchMock.patch(url, 500)

        await expect(setUIExtension(secret, installInfo)).rejects.toThrowError(ErrorSetUiExtension)
    })
})

describe('requestRights', () => {
    const fetchMock: any = fetch
    const token = faker.string.uuid()
    const secret = new OrganizationSecret(faker.string.uuid(), faker.string.uuid(), faker.internet.url({ appendSlash: false }))
    secret.getBearerToken = jest.fn().mockReturnValue(token)
    const url = `${secret.serverUrl}/api/http/applications/clientId:${secret.clientId}/authorizations/authorized-rights/request-rights`
    const installInfo = getInstallInfo()

    afterEach(() => {
        fetchMock.mockReset()
    })

    it('should success', async () => {
        fetchMock.patch(url, 204)

        await requestRights(secret, installInfo)
        expect(fetchMock).toHaveFetched(url, {
            method: 'PATCH',
            headers: {
                Authorization: token,
            },
            body: installInfo.right,
        })
    })

    it('should throw ErrorRequestRights error when fail', async () => {
        fetchMock.patch(url, 500)

        await expect(requestRights(secret, installInfo)).rejects.toThrowError(ErrorRequestRights)
    })
})
