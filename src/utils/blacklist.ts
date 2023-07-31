import { LRUCache } from 'lru-cache'

const blacklist: LRUCache<string, boolean> = new LRUCache<string, boolean>({
    max: 5000,
})

export function revokeToken(token: string) {
    const key = `REVOKED_TOKEN_${token}`
    blacklist.set(key, true)
}

// todo: 추후 권한 관련 미들웨어에서 사용할 함수
export function checkTokenIsRevoked(token: string): boolean {
    return blacklist.has(token)
}
