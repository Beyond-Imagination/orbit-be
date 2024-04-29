export class APIError extends Error {
    statusCode: number
    errorCode: number
    message: string
    cause: Error | string
    isOrbitError: boolean

    constructor(statusCode: number, errorCode: number, message: string, cause: Error | string = null) {
        super(message)

        this.statusCode = statusCode
        this.errorCode = errorCode
        this.message = message
        this.cause = cause
        this.isOrbitError = true
    }

    toJSON() {
        return {
            status: this.statusCode,
            code: this.errorCode,
            message: this.message,
            stack: this.stack,
            cause: this.cause,
        }
    }
}
