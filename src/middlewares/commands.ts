import { NextFunction, Request, Response } from 'express'

import { MessagePayload } from '@types/space'

export const addRegex = /"[^"]+"|\w+/g

export async function addCommandValidator(req: Request, res: Response, next: NextFunction) {
    const body = req.body as MessagePayload
    const [command, channelName, cron, message, ...rest] = body.message.body.text.match(addRegex)

    if (rest.length) {
        // todo: send error message
        return res.sendStatus(204)
    }

    if (!message) {
        // todo: send error message
        return res.sendStatus(204)
    }

    if (!cron) {
        // todo: send error message if invalid cron format
        return res.sendStatus(204)
    }

    if (!channelName) {
        // todo: send error message if channelName is not exist
        return res.sendStatus(204)
    }

    if (command !== 'add') {
        // todo: send error message
        return res.sendStatus(204)
    }

    req.command = {
        channelName,
        cron,
        message,
    }
    next()
}
