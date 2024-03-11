import { NextFunction, Request, Response } from 'express'
import { APIError } from '@/types/errors'
import { logger } from '@utils/logger'

const errorMiddleware = (error: APIError, req: Request, res: Response, next: NextFunction) => {
    try {
        res.meta.error = error
        res.status(error.statusCode).json({ message: error.message, code: error.errorCode, cause: error.cause })
    } catch (err) {
        logger.error('fail in error middleware', { original: error, new: err })
        res.status(500).json({ message: 'internal server error' })
    }
}

export default errorMiddleware
