import express, { NextFunction, Request, Response } from 'express'
import asyncify from 'express-asyncify'
import cronParser from 'cron-parser'

import middlewares from '@middlewares'
import { space } from '@/types'
import { OrbitModel } from '@/models'
import { sendAddSuccessMessage, sendDeleteSuccessMessage, sendOrbitListMessage } from '@services/space'

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
                name: 'update',
                description: 'update an orbit message',
            },
            {
                name: 'delete',
                description: 'delete an orbit message',
            },
        ],
    }
    res.status(200).json(commands)
})

router.post('/orbit', middlewares.commands.addCommandValidator, async (req, res, next) => {
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
    await sendAddSuccessMessage(req.organization, req.bearerToken, body.userId)
    res.sendStatus(204)
})

router.get('/orbit', async (req, res, next) => {
    const body = req.body as space.MessagePayload
    const orbits = await OrbitModel.findByClientId(req.organization.clientId)
    // TODO send different message when orbits is empty array
    await sendOrbitListMessage(req.organization, req.bearerToken, body.userId, orbits)
    res.sendStatus(204)
})

router.put('/orbit', async (req, res, next) => {
    // TODO orbit update command
    res.status(200).json({ path: '/v1/commands/orbit', method: 'put' })
})

router.delete(
    '/orbit',
    (req: Request, res: Response, next: NextFunction) => {
        req._routeBlacklists.body = ['message']
        next()
    },
    async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body as space.MessageActionPayload
        await OrbitModel.deleteById(body.actionValue)
        await sendDeleteSuccessMessage(req.organization, req.bearerToken, body.userId)
        res.sendStatus(204)
    },
)

export default router
