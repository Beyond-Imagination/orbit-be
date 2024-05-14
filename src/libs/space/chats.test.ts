import fetchMockJest from 'fetch-mock-jest'
import fetch from 'node-fetch'
import { faker } from '@faker-js/faker'

import { OrganizationSecret } from '@/models'
import { sendTextMessage } from '@/libs/space/chats'

jest.mock('node-fetch', () => fetchMockJest.sandbox())

describe('sendMessage', () => {
    const fetchMock: any = fetch
    const secret = new OrganizationSecret(faker.string.uuid(), faker.string.uuid(), faker.internet.url({ appendSlash: false }))
    secret.getBearerToken = jest.fn().mockReturnValue(faker.string.uuid())
    const url = `${secret.serverUrl}/api/http/chats/messages/send-message`

    afterEach(() => {
        fetchMock.mockReset()
    })

    it('should success', async () => {
        const userId = faker.string.uuid()
        const text = faker.lorem.sentence(5)

        fetchMock.post(url, 200)

        const result = await sendTextMessage(secret, userId, text)
        expect(result).toEqual(true)
        expect(fetchMock).toHaveLastFetched(url, {
            method: 'POST',
            body: {
                channel: `member:id:${userId}`,
                content: {
                    className: 'ChatMessage.Text',
                    text: text,
                },
            },
        })
    })
})
