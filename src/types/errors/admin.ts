import { APIError } from '@types/errors/error'

export class AlreadyExistedUsername extends APIError {
    constructor() {
        super(400, 800, 'already existed username')
        Object.setPrototypeOf(this, AlreadyExistedUsername.prototype)
        Error.captureStackTrace(this, AlreadyExistedUsername)
    }
}
