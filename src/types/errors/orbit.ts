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

export class FailSendOrbitMessage extends APIError {
    constructor(cause: Error | string = null) {
        super(500, 610, 'fail send orbit message', cause)
        Object.setPrototypeOf(this, FailSendOrbitMessage.prototype)
        Error.captureStackTrace(this, FailSendOrbitMessage)
    }
}
