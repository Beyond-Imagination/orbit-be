import express from 'express'
import asyncify from 'express-asyncify'

import { ApplicationUninstalledPayload, ChangeServerUrlPayload, InitPayload } from '@/types/space'
import { OrganizationModel } from '@/models'
import { VERSION } from '@config'

const router = asyncify(express.Router())

router.get('/', (req, res) => {
    res.status(200).json({ path: 'webhooks' })
})

router.post('/install', async (req, res) => {
    const body = req.body as InitPayload
    // TODO call space api for ui extension and rights
    await OrganizationModel.create({
        clientId: body.clientId,
        clientSecret: body.clientSecret,
        serverUrl: body.serverUrl,
        admin: [body.userId],
        version: VERSION,
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
