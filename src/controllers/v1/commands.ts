import express from 'express'
import asyncify from 'express-asyncify'

import middlewares from '@middlewares'
import { space } from '@/types'

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

router.use(middlewares.space.commandRouter)

router.post('/orbit', middlewares.commands.addCommandValidator, async (req, res, next) => {
    // TODO orbit add command
    res.status(200).json({ path: '/v1/commands/orbit', method: 'post' })
})

router.get('/orbit', async (req, res, next) => {
    // TODO orbit list command
    res.status(200).json({ path: '/v1/commands/orbit', method: 'get' })
})

router.put('/orbit', async (req, res, next) => {
    // TODO orbit update command
    res.status(200).json({ path: '/v1/commands/orbit', method: 'put' })
})

router.delete('/orbit', async (req, res, next) => {
    // TODO orbit delete command
    res.status(200).json({ path: '/v1/commands/orbit', method: 'delete' })
})

export default router
