import express from 'express'
import asyncify from 'express-asyncify'

import { ApplicationUninstalledPayload, ChangeServerUrlPayload, InitPayload } from '@/types/space'
import middlewares from '@/middlewares'
import { OrganizationModel } from '@/models'
import { install } from '@/services/space'
import { getInstallInfo } from '@/utils/version'

const router = asyncify(express.Router())

router.use(middlewares.space.verifySpaceRequest)

router.post('/install', async (req, res) => {
    const body = req.body as InitPayload
    // TODO call space api for ui extension and rights
    const installInfo = getInstallInfo()
    await install(req.organizationSecret, installInfo)
    await OrganizationModel.create({
        clientId: body.clientId,
        clientSecret: body.clientSecret,
        serverUrl: body.serverUrl,
        admin: [body.userId],
        version: installInfo.version,
    })
    res.status(204).send()
})

router.put('/changeServerUrl', async (req, res) => {
    const body = req.body as ChangeServerUrlPayload
    await OrganizationModel.updateServerUrlByClientId(body.clientId, body.newServerUrl)
    res.status(204).send()
})

router.delete('/uninstall', async (req, res) => {
    const body = req.body as ApplicationUninstalledPayload
    await OrganizationModel.deleteByClientId(body.clientId)
    res.status(204).send()
})

export default router
