import { Request, Response } from 'express'
import { DeleteResult } from 'mongodb'
import cronParser from 'cron-parser'

import { Orbit, OrbitModel } from '@/models'
import { InvalidOrbitId } from '@/types/errors'
import { sendChannelMessage } from '@/libs/space'

export async function getOrbits(req: Request, res: Response) {
    const results: Orbit[] = await OrbitModel.findByClientId(req.organization.clientId)
    res.status(200).json({ orbits: results })
}

export async function createOrbit(req: Request, res: Response) {
    await OrbitModel.create({
        organization: req.organization._id,
        clientId: req.organization.clientId,
        authorId: req.user.id,
        channelName: req.body.channelName,
        type: req.body.type,
        message: req.body.message,
        cron: req.body.cron,
        weekly: req.body.weekly,
        timezone: req.body.timezone,
        nextExecutionTime: cronParser
            .parseExpression(req.body.cron, {
                tz: req.body.timezone,
            })
            .next(),
        status: 'scheduled',
    })

    res.sendStatus(204)
}

export async function updateOrbit(req: Request, res: Response) {
    const filter = { _id: req.params.id }
    const options = { tz: req.body.timezone }
    const update = {
        channelName: req.body.channelName,
        type: req.body.type,
        message: req.body.message,
        cron: req.body.cron,
        weekly: req.body.weekly,
        timezone: req.body.timezone,
        nextExecutionTime: cronParser.parseExpression(req.body.cron, options).next().toDate(),
        status: 'scheduled',
    }
    await OrbitModel.findOneAndUpdate(filter, update)

    res.sendStatus(204)
}

export async function deleteOrbit(req: Request, res: Response) {
    const deleteResult: DeleteResult = await OrbitModel.deleteById(req.params.id)
    if (deleteResult.deletedCount === 0) {
        throw new InvalidOrbitId()
    }
    res.sendStatus(204)
}

export async function sendOrbitMessage(req: Request, res: Response) {
    const orbit = await OrbitModel.findById(req.params.id)
    await sendChannelMessage(req.organization, orbit.channelName, orbit.message, false)

    res.sendStatus(204)
}
