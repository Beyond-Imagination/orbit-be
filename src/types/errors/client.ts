import { APIError } from '@/types/errors/error'

export class BadRequest extends APIError {
    constructor() {
        super(400, 400, 'bad request')
        Object.setPrototypeOf(this, BadRequest.prototype)
        Error.captureStackTrace(this, BadRequest)
    }
}

export class Unauthorized extends APIError {
    constructor() {
        super(401, 401, 'unauthorized')
        Object.setPrototypeOf(this, Unauthorized.prototype)
        Error.captureStackTrace(this, Unauthorized)
    }
}
