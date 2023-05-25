import { APIError } from '@/types/errors/error'

export class InvalidClassName extends APIError {
    constructor() {
        super(401, 700, 'invalid class name')
        Object.setPrototypeOf(this, InvalidClassName.prototype)
        Error.captureStackTrace(this, InvalidClassName)
    }
}
