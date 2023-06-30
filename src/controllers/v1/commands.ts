import express, { NextFunction, Request, Response } from 'express'
import asyncify from 'express-asyncify'
import cronParser from 'cron-parser'

import middlewares from '@middlewares'
import { space } from '@/types'
import { OrbitModel } from '@/models'
import * as chat from '@services/space/chats'

const router = asyncify(express.Router())

router.use(middlewares.space.verifySpaceRequest)

router.get('/list', async (req, res) => {
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
})

router.get('/help', async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as space.MessagePayload
    await chat.sendHelpMessage(req.organization, body.userId)
    res.sendStatus(204)
})

router.post('/orbit', middlewares.commands.addCommandValidator, middlewares.commands.orbitMaxCountLimiter, async (req, res, next) => {
    const body = req.body as space.MessagePayload
    await OrbitModel.create({
        organization: req.organization._id,
        clientId: body.clientId,
        channelName: req.command.channelName,
        message: req.command.message,
        cron: req.command.cron,
        authorId: body.userId,
        nextExecutionTime: cronParser.parseExpression(req.command.cron).next(),
    })
    await chat.sendAddSuccessMessage(req.organization, body.userId)
    res.sendStatus(204)
})

router.get('/orbit', async (req, res, next) => {
    const body = req.body as space.MessagePayload
    const orbits = await OrbitModel.findByClientId(req.organization.clientId)
    if (orbits.length) {
        await chat.sendOrbitListMessage(req.organization, body.userId, orbits)
    } else {
        await chat.sendEmptyOrbitListMessage(req.organization, body.userId)
    }
    res.sendStatus(204)
})

router.delete(
    '/orbit',
    (req: Request, res: Response, next: NextFunction) => {
        req._routeBlacklists.body = ['message']
        next()
    },
    async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body as space.MessageActionPayload
        const result = await OrbitModel.deleteById(body.actionValue)
        if (result.deletedCount > 0) {
            await chat.sendDeleteSuccessMessage(req.organization, body.userId)
        } else {
            await chat.sendDeleteFailMessage(req.organization, body.userId)
        }
        res.sendStatus(204)
    },
)

export default router
