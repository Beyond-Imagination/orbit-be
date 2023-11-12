import { checkTokenIsRevoked, revokeToken } from '@utils/blacklist'

jest.setTimeout(30000)

const TOKEN = 'bearer valid_token'
const NOT_REVOKED_TOKEN = 'bearer not_revoked_token'

// revokeToken 테스트는 checkTokenIsRevoked에 의존합니다
describe('revokeToken', () => {
    it('은 revoke된 토큰에 대해서 false값을 반환한다.', async () => {
        revokeToken(TOKEN)
        expect(checkTokenIsRevoked(TOKEN)).toEqual(true)
    })

    it('은 revoke되지 않은 토큰에 대해서 true값을 반환한다.', async () => {
        expect(checkTokenIsRevoked(NOT_REVOKED_TOKEN)).toEqual(false)
    })
})
