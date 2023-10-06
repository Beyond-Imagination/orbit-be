import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'
import cronParser from 'cron-parser'
import { DeleteResult } from 'mongodb'

import { InvalidOrbitId } from '@/types/errors/orbit'
import { verifyUserRequest } from '@/middlewares/space'
import { Orbit, OrbitModel } from '@/models'
import { sendChannelMessage } from '@/services/space/chats'
import middlewares from '@middlewares'

const router = asyncify(express.Router())

router.get('/', verifyUserRequest, async (req: Request, res: Response) => {
    const results: Orbit[] = await OrbitModel.findByClientId(req.organization.clientId)
    res.status(200).json({ orbits: results })
})

router.post(
    '/',
    verifyUserRequest,
    middlewares.orbit.verifyPostMessage,
    middlewares.commands.orbitMaxCountLimiter,
    async (req: Request, res: Response) => {
        // TODO: set middleware to identify orbit message author info
        await OrbitModel.create({
            organization: req.organization._id,
            clientId: req.organization.clientId,
            authorId: null,
            channelName: req.body.channelName,
            format: req.body.format,
            message: req.body.message,
            cron: req.body.cron,
            timezone: req.body.timezone,
            nextExecutionTime: cronParser
                .parseExpression(req.body.cron, {
                    tz: req.body.timezone,
                })
                .next(),
        })

        res.sendStatus(204)
    },
)

router.put('/:id', verifyUserRequest, async (req: Request, res: Response) => {
    const filter = { _id: req.params.id }
    const options = { tz: req.body.timezone }
    const update = {
        channelName: req.body.channelName,
        format: req.body.format,
        message: req.body.message,
        cron: req.body.cron,
        timezone: req.body.timezone,
        nextExecutionTime: cronParser.parseExpression(req.body.cron, options).next().toDate(),
    }
    await OrbitModel.findOneAndUpdate(filter, update)

    res.sendStatus(204)
})

router.delete('/:id', verifyUserRequest, async (req: Request, res: Response) => {
    const deleteResult: DeleteResult = await OrbitModel.deleteById(req.params.id)
    if (deleteResult.deletedCount === 0) {
        throw new InvalidOrbitId()
    }
    res.sendStatus(204)
})

router.post('/:id/send', verifyUserRequest, async (req: Request, res: Response) => {
    const orbit = await OrbitModel.findById(req.params.id)
    await sendChannelMessage(req.organization, orbit.channelName, orbit.message)

    res.sendStatus(204)
})

export default router
