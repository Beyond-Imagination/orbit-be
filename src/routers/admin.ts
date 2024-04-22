import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'

import { approve, login, logout, register, versionUpdate } from '@/services/admin'
import middlewares from '@/middlewares'
import { adminApproveRequest, adminLoginRequest, adminLoginResponse, adminRegisterRequest, organizationVersionUpdateRequest } from '@/types/admin'

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

router.post('/logout', middlewares.admin.verifyAdminRequest, async (req, res) => {
    const jwt = req.header('authorization')
    logout(jwt)
    res.sendStatus(204)
})

router.post('/approve', middlewares.admin.verifyAdminRequest, async (req, res) => {
    const body = req.body as adminApproveRequest
    await approve(body)
    res.sendStatus(204)
})

router.patch(
    '/organization/version',
    middlewares.admin.verifyAdminRequest,
    middlewares.space.setOrganization,
    async (req: Request, res: Response) => {
        const body = req.body as organizationVersionUpdateRequest
        await versionUpdate(req.organization, body.version)
        res.sendStatus(204)
    },
)

export default router
