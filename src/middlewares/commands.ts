import { NextFunction, Request, Response } from 'express'
import cronParser from 'cron-parser'
import moment from 'moment-timezone'

import { MessagePayload } from '@/types/space'
import { sendAddFailMessage } from '@/libs/space'

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
    let timezone, format

    channelName = removeSurroundingDoubleQuote(channelName)
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

    const cronLength = cron.split(' ').length
    if (!cron || (cronLength !== 5 && cronLength !== 6)) {
        await sendAddFailMessage(req.organization, body.userId)
        return res.sendStatus(204)
    } else {
        format = 'cron'
        if (cronLength === 6) {
            // has timezone
            const lastSpaceIndex = cron.lastIndexOf(' ')
            timezone = cron.slice(lastSpaceIndex + 1)
            cron = cron.slice(0, lastSpaceIndex)
            if (moment.tz.zone(timezone) === null) {
                await sendAddFailMessage(req.organization, body.userId)
                return res.sendStatus(204)
            }
        }
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
        format,
        channelName,
        cron,
        timezone,
        message,
    }

    next()
}
