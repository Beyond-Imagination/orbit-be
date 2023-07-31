import express from 'express'
import asyncify from 'express-asyncify'
import { adminLoginRequest, adminLoginResponse, adminLogoutRequest, adminRegisterRequest } from '@/types/admin'
import { login, logout, register } from '@services/admin'

const router = asyncify(express.Router())

router.post('/register', async (req, res) => {
    const body = req.body as adminRegisterRequest
    await register(body.username, body.password, body.name)
    res.sendStatus(204)
})

router.post('/login', async (req, res) => {
    const body = req.body as adminLoginRequest
    const response: adminLoginResponse = await login(body.username, body.password)
    res.status(200).json(response)
})

router.post('/logout', async (req, res) => {
    const body = req.body as adminLogoutRequest
    logout(body.jwt)
    res.sendStatus(204)
})

export default router
