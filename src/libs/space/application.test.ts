import { getAccessToken, getPublicKeys } from '@/libs/space/application'
import { Unauthorized } from '@/types/errors'
import { OrganizationSecret } from '@/models'

jest.setTimeout(30000)

describe('getAccessToken', () => {
    it('should success with valid secret', async () => {
        // local test application secret
        const secret = new OrganizationSecret(
            '8ea1d9ae-1d89-4954-ac67-777724dcab82',
            '5a9e1896ade629269a0af3200a2187e128e16482b5777a7411c3f21afa79eaa9',
            'https://beyond-imagination.jetbrains.space',
        )
        const result = await getAccessToken(secret)
        console.log(result)
        expect(result.expires_in).toEqual(600)
        expect(result.scope).toEqual('**')
        expect(result.token_type).toEqual('Bearer')
    })

    it('should fail with invalid secret', async () => {
        const secret = new OrganizationSecret('invalid', 'invalid', 'https://beyond-imagination.jetbrains.space')
        await expect(getAccessToken(secret)).rejects.toThrowError(Unauthorized)
    })
})

describe('getPublicKeys', () => {
    it('should success with valid secret', async () => {
        // local test application secret
        const secret = new OrganizationSecret(
            '8ea1d9ae-1d89-4954-ac67-777724dcab82',
            '5a9e1896ade629269a0af3200a2187e128e16482b5777a7411c3f21afa79eaa9',
            'https://beyond-imagination.jetbrains.space',
        )
        const token = 'Bearer ' + (await getAccessToken(secret)).access_token
        const result = await getPublicKeys(secret, token)
        expect(result.keys.length).toBeGreaterThanOrEqual(1)
    })

    it('should fail with invalid secret', async () => {
        const secret = new OrganizationSecret('invalid', 'invalid', 'https://beyond-imagination.jetbrains.space')
        const token = 'invalid'
        await expect(getPublicKeys(secret, token)).rejects.toThrowError(Unauthorized)
    })
})
