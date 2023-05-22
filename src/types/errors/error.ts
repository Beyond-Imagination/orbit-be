export class APIError extends Error {
    statusCode: number
    errorCode: number
    message: string

    constructor(statusCode: number, errorCode: number, message: string) {
        super(message)

        this.statusCode = statusCode
        this.errorCode = errorCode
        this.message = message
    }

    toJSON() {
        return {
            status: this.statusCode,
            code: this.errorCode,
            message: this.message,
            stack: this.stack,
        }
    }
}
