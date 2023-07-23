import express from 'express'
import asyncify from 'express-asyncify'
import { adminRegisterRequest } from '@/types/admin'
import { register } from '@services/admin'

const router = asyncify(express.Router())

router.post('/register', async (req, res) => {
    const body = req.body as adminRegisterRequest
    await register(body.username, body.password, body.name)
    res.sendStatus(204)
})

export default router
