import { config } from 'dotenv'
import { version } from '../../package.json'

config()

export const { NODE_ENV, PORT, DB_URI, DB_NAME } = process.env
export const VERSION = version

export function isProduction(): boolean {
    return NODE_ENV === 'production'
}

export const CLIENT_URL = process.env.CLIENT_URL || ''

export const MESSENGER_CONCURRENCY = Number.parseInt(process.env.MESSENGER_CONCURRENCY) || 500
export const MAX_ORBIT_COUNT = Number.parseInt(process.env.MAX_ORBIT_COUNT) || 20
export const SALT_ROUNDS = Number.parseInt(process.env.SALT_ROUNDS) || 10
export const SECRET_KEY = process.env.SECRET_KEY || 'secret'
