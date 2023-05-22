import { config } from 'dotenv'
import { version } from '../../package.json'

config()

export const { NODE_ENV, PORT } = process.env
export const VERSION = version

export function isProduction(): boolean {
    return NODE_ENV === 'production'
}