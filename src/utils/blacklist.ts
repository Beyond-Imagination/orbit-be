import { LRUCache } from 'lru-cache'

const blacklist: LRUCache<string, boolean> = new LRUCache<string, boolean>({
    max: 5000,
})

function getRevokedTokenKey(token: string) {
    return `REVOKED_TOKEN_${token}`
}

export function revokeToken(token: string) {
    const key = getRevokedTokenKey(token)
    blacklist.set(key, true)
}

export function checkTokenIsRevoked(token: string): boolean {
    return blacklist.has(getRevokedTokenKey(token))
}
