import { APIError } from '@/types/errors/error'

export class InternalServerError extends APIError {
    constructor() {
        super(500, 500, 'internal serve error')
        Object.setPrototypeOf(this, InternalServerError.prototype)
        Error.captureStackTrace(this, InternalServerError)
    }
}
