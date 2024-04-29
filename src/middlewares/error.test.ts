import { getMockReq, getMockRes } from '@jest-mock/express'

import errorMiddleware from '@/middlewares/error'
import { InternalServerError } from '@/types/errors'

describe('errorMiddleware', () => {
    it('should send error response', async () => {
        const req = getMockReq({})
        const { res, next } = getMockRes({ meta: {} })
        const error = new InternalServerError('error')

        errorMiddleware(error, req, res, next)

        expect(res.status).toBeCalledWith(error.statusCode)
        expect(res.json).toBeCalledWith({ message: error.message, code: error.errorCode, cause: error.cause })
    })
})
