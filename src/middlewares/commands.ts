import { NextFunction, Request, Response } from 'express'

import { MessagePayload } from '@types/space'
import { sendAddFailMessage } from '@services/space'

export const addRegex = /"[^"]+"|\w+/g

export async function addCommandValidator(req: Request, res: Response, next: NextFunction) {
    const body = req.body as MessagePayload
    const [command, channelName, cron, message, ...rest] = body.message.body.text.match(addRegex)

    if (rest.length) {
        await sendAddFailMessage(req.organization, req.bearerToken, body.userId)
        return res.sendStatus(204)
    }

    if (!message) {
        await sendAddFailMessage(req.organization, req.bearerToken, body.userId)
        return res.sendStatus(204)
    }

    if (!cron) {
        // todo: check if cron is valid
        await sendAddFailMessage(req.organization, req.bearerToken, body.userId)
        return res.sendStatus(204)
    }

    if (!channelName) {
        // todo: check if channelName exist
        await sendAddFailMessage(req.organization, req.bearerToken, body.userId)
        return res.sendStatus(204)
    }

    if (command !== 'add') {
        await sendAddFailMessage(req.organization, req.bearerToken, body.userId)
        return res.sendStatus(204)
    }

    req.command = {
        channelName,
        cron,
        message,
    }
    next()
}
