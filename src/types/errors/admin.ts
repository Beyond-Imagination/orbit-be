import { APIError } from '@types/errors/error'

export class AlreadyExistedUsername extends APIError {
    constructor() {
        super(400, 800, 'already existed username')
        Object.setPrototypeOf(this, AlreadyExistedUsername.prototype)
        Error.captureStackTrace(this, AlreadyExistedUsername)
    }
}

export class AdminNotFound extends APIError {
    constructor() {
        super(404, 804, 'admin not found')
        Object.setPrototypeOf(this, AdminNotFound.prototype)
        Error.captureStackTrace(this, AdminNotFound)
    }
}

export class AdminNotPermitted extends APIError {
    constructor() {
        super(401, 801, 'admin not permitted')
        Object.setPrototypeOf(this, AdminNotPermitted.prototype)
        Error.captureStackTrace(this, AdminNotPermitted)
    }
}

export class AuthenticationFailed extends APIError {
    constructor() {
        super(400, 817, 'password not matched. check your password again')
        Object.setPrototypeOf(this, AuthenticationFailed.prototype)
        Error.captureStackTrace(this, AuthenticationFailed)
    }
}
