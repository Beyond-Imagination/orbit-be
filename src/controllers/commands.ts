import { Request, Response } from 'express'
import cronParser from 'cron-parser'

import { space } from '@/types'
import * as chat from '@/libs/space/chats'
import { OrbitModel } from '@/models'

export async function list(req: Request, res: Response) {
    const commands: space.Commands = {
        commands: [
            {
                name: 'add',
                description: 'add a new orbit message',
            },
            {
                name: 'list',
                description: 'show registered orbit messages',
            },
            {
                name: 'help',
                description: 'show help message',
            },
        ],
    }
    res.status(200).json(commands)
}

export async function help(req: Request, res: Response) {
    const body = req.body as space.MessagePayload
    await chat.sendHelpMessage(req.organization, body.userId)
    res.sendStatus(204)
}

export async function createOrbitCommand(req: Request, res: Response) {
    const body = req.body as space.MessagePayload
    const options = { tz: req.command.timezone }
    await OrbitModel.create({
        organization: req.organization._id,
        clientId: body.clientId,
        channelName: req.command.channelName,
        format: req.command.format,
        message: req.command.message,
        cron: req.command.cron,
        timezone: req.command.timezone,
        authorId: body.userId,
        nextExecutionTime: cronParser.parseExpression(req.command.cron, options).next(),
        status: 'scheduled',
    })
    await chat.sendAddSuccessMessage(req.organization, body.userId)
    res.sendStatus(204)
}

export async function getOrbitCommand(req: Request, res: Response) {
    const body = req.body as space.MessagePayload
    const orbits = await OrbitModel.findByClientId(req.organization.clientId)
    if (orbits.length) {
        await chat.sendOrbitListMessage(req.organization, body.userId, orbits)
    } else {
        await chat.sendEmptyOrbitListMessage(req.organization, body.userId)
    }
    res.sendStatus(204)
}

export async function deleteOrbitCommand(req: Request, res: Response) {
    const body = req.body as space.MessageActionPayload
    const result = await OrbitModel.deleteById(body.actionValue)
    if (result.deletedCount > 0) {
        await chat.sendDeleteSuccessMessage(req.organization, body.userId)
    } else {
        await chat.sendDeleteFailMessage(req.organization, body.userId)
    }
    res.sendStatus(204)
}
