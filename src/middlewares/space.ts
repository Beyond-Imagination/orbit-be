import { NextFunction, Request, RequestHandler, Response } from 'express'

import { InvalidClassName } from '@/types/errors'

export const classNameValidator = (className: string): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (className === req.body.className) {
            next()
        } else {
            next(new InvalidClassName())
        }
    }
}

const classNameRouter = (req: Request, res: Response, next: NextFunction) => {
    try {
        switch (req.body.className) {
            case 'InitPayload':
                req.url = '/v1/webhooks/install'
                req.method = 'post'
                break
            case 'ChangeServerUrlPayload':
                req.url = '/v1/webhooks/changeServerUrl'
                req.method = 'put'
                break
            case 'ApplicationUninstalledPayload':
                req.url = '/v1/webhooks/uninstall'
                req.method = 'delete'
                break
            case 'ListCommandsPayload':
                req.url = '/v1/commands'
                req.method = 'get'
                break
            default:
                throw new InvalidClassName()
        }
        next()
    } catch (e) {
        next(e)
    }
}

export default {
    classNameRouter,
}
