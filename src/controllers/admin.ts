import { Request, Response } from 'express'

import { adminApproveRequest, adminLoginRequest, adminLoginResponse, adminRegisterRequest, organizationVersionUpdateRequest } from '@/types/admin'
import { approve, login, logout, register, versionUpdate } from '@/services/admin'

export async function registerAdmin(req: Request, res: Response) {
    const body = req.body as adminRegisterRequest
    await register(body.username, body.password, body.name)
    res.sendStatus(204)
}

export async function loginAdmin(req: Request, res: Response) {
    const body = req.body as adminLoginRequest
    const response: adminLoginResponse = await login(body.username, body.password)
    res.status(200).json(response)
}

export async function logoutAdmin(req: Request, res: Response) {
    const jwt = req.header('authorization')
    logout(jwt)
    res.sendStatus(204)
}

export async function approveAdmin(req: Request, res: Response) {
    const body = req.body as adminApproveRequest
    await approve(body)
    res.sendStatus(204)
}

export async function updateOrganization(req: Request, res: Response) {
    const body = req.body as organizationVersionUpdateRequest
    await versionUpdate(req.organization, body.version)
    res.sendStatus(204)
}
