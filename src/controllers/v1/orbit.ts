import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'

import { verifyUserRequest } from '@/middlewares/space'
import { OrbitModel } from '@/models'
import { sendChannelMessage } from '@/services/space/chats'
import { DeleteResult } from 'mongodb'
import { InvalidOrbitId } from '@types/errors/orbit'

const router = asyncify(express.Router())

router.get('/', verifyUserRequest, (req: Request, res: Response) => {
    // const organization = req.organization
    // TODO: response orbit list of organization
    res.status(200).json({ path: 'orbit' })
})

router.post('/', verifyUserRequest, (req: Request, res: Response) => {
    // TODO: save orbit message
    res.sendStatus(204)
})

router.put('/:id', verifyUserRequest, (req: Request, res: Response) => {
    // TODO: update orbit message
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
