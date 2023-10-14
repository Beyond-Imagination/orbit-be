import { APIError } from '@/types/errors/error'

export class InvalidOrbitId extends APIError {
    constructor() {
        super(400, 600, 'invalid orbit id')
        Object.setPrototypeOf(this, InvalidOrbitId.prototype)
        Error.captureStackTrace(this, InvalidOrbitId)
    }
}

export class MaxOrbitMessage extends APIError {
    constructor() {
        super(400, 601, 'max orbit message count')
        Object.setPrototypeOf(this, MaxOrbitMessage.prototype)
        Error.captureStackTrace(this, MaxOrbitMessage)
    }
}
