import { config } from 'dotenv'
import { version } from '../../package.json'

config()

export const { NODE_ENV, PORT, DB_URI, DB_NAME } = process.env
export const VERSION = version

export function isProduction(): boolean {
    return NODE_ENV === 'production'
}

export const MESSENGER_CONCURRENCY = Number.parseInt(process.env.MESSENGER_CONCURRENCY) || 500
export const MAX_ORBIT_COUNT = Number.parseInt(process.env.MAX_ORBIT_COUNT) || 20
