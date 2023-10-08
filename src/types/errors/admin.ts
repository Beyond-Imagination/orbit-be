import { APIError } from '@/types/errors/error'

export class AlreadyExistedUsernameException extends APIError {
    constructor() {
        super(400, 800, 'already existed username')
        Object.setPrototypeOf(this, AlreadyExistedUsernameException.prototype)
        Error.captureStackTrace(this, AlreadyExistedUsernameException)
    }
}

export class AdminNotFoundException extends APIError {
    constructor() {
        super(404, 804, 'admin not found')
        Object.setPrototypeOf(this, AdminNotFoundException.prototype)
        Error.captureStackTrace(this, AdminNotFoundException)
    }
}

export class AdminNotApprovedException extends APIError {
    constructor() {
        super(401, 801, 'admin not approved')
        Object.setPrototypeOf(this, AdminNotApprovedException.prototype)
        Error.captureStackTrace(this, AdminNotApprovedException)
    }
}

export class AuthenticationFailedException extends APIError {
    constructor() {
        super(400, 817, 'password not matched. check your password again')
        Object.setPrototypeOf(this, AuthenticationFailedException.prototype)
        Error.captureStackTrace(this, AuthenticationFailedException)
    }
}

export class InvalidJWTException extends APIError {
    constructor(cause: Error | string = null) {
        super(401, 801, 'invalid jwt', cause)
        Object.setPrototypeOf(this, InvalidJWTException.prototype)
        Error.captureStackTrace(this, InvalidJWTException)
    }
}
