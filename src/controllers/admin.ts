import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'

import { adminLoginRequest, adminLoginResponse, adminLogoutRequest, adminRegisterRequest, organizationVersionUpdateRequest } from '@/types/admin'
import { login, logout, register, versionUpdate } from '@services/admin'
import { setOrganization } from '@/middlewares/space'

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

router.patch('/organization/version', setOrganization, async (req: Request, res: Response) => {
    const body = req.body as organizationVersionUpdateRequest
    await versionUpdate(req.organization, body.version)
    res.sendStatus(204)
})

export default router
