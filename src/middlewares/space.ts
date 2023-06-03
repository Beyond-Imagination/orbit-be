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

export const classNameRouter = (req: Request, res: Response, next: NextFunction) => {
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
            req.url = '/v1/commands/list'
            req.method = 'get'
            break
        case 'MessagePayload':
            req.url = '/v1/commands'
            req.method = 'post'
            break
    }
    next()
}

export const commandRouter = (req, res, next) => {
    const commands = req.body.message.body.text.split(' ')
    switch (commands[0]) {
        case 'add':
            req.url = '/orbit'
            req.method = 'post'
            break
        case 'list':
            req.url = '/orbit'
            req.method = 'get'
            break
        case 'update':
            req.url = '/orbit'
            req.method = 'put'
            break
        case 'delete':
            req.url = '/orbit'
            req.method = 'delete'
            break
    }
    next()
}
