import express from 'express'
import asyncify from 'express-asyncify'

import middlewares from '@middlewares'

const router = asyncify(express.Router())

router.use(middlewares.space.verifySpaceRequest)

router.get('/list', async (req, res) => {
    // TODO response command list
    res.status(200).json({ path: '/v1/commands/list' })
})

router.use(middlewares.space.commandRouter)

router.post('/orbit', async (req, res, next) => {
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
