import { NextFunction, Request, Response } from 'express'
import cronParser from 'cron-parser'

import { MessagePayload } from '@types/space'
import { sendAddFailMessage } from '@services/space'

export const addRegex = /"[^"]+"|\w+/g

export function removeSurroundingDoubleQuote(text: string): string {
    if (!text?.length) {
        return ''
    }

    const start = text.at(0) === '"' ? 1 : 0
    const end = text.at(-1) === '"' ? -1 : text.length

    return text.slice(start, end)
}

export async function addCommandValidator(req: Request, res: Response, next: NextFunction) {
    const body = req.body as MessagePayload
    let [command, channelName, cron, message, ...rest] = body.message.body.text.match(addRegex) // eslint-disable-line

    cron = removeSurroundingDoubleQuote(cron)
    message = removeSurroundingDoubleQuote(message)

    if (rest.length) {
        await sendAddFailMessage(req.organization, body.userId)
        return res.sendStatus(204)
    }

    if (!message) {
        await sendAddFailMessage(req.organization, body.userId)
        return res.sendStatus(204)
    }

    if (!cron || cron.split(' ').length !== 5) {
        await sendAddFailMessage(req.organization, body.userId)
        return res.sendStatus(404)
    } else {
        try {
            cronParser.parseExpression(cron)
        } catch (e) {
            await sendAddFailMessage(req.organization, body.userId)
            return res.sendStatus(204)
        }
    }

    if (!channelName) {
        // todo: check if channelName exist
        await sendAddFailMessage(req.organization, body.userId)
        return res.sendStatus(204)
    }

    if (command !== 'add') {
        await sendAddFailMessage(req.organization, body.userId)
        return res.sendStatus(204)
    }

    req.command = {
        channelName,
        cron,
        message,
    }
    next()
}
