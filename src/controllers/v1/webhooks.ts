import express from 'express'
import asyncify from 'express-asyncify'

import { ApplicationUninstalledPayload, ChangeServerUrlPayload, InitPayload } from '@/types/space'
import middlewares from '@/middlewares'
import { OrganizationModel } from '@/models'
import { getApplication, install } from '@/services/space'
import { getInstallInfo, gettingStartedUrl } from '@/utils/version'

const router = asyncify(express.Router())

router.use(middlewares.space.verifySpaceRequest)

router.post('/install', async (req, res) => {
    const body = req.body as InitPayload
    const installInfo = getInstallInfo()
    const application = await getApplication(req.organizationSecret)
    installInfo.uiExtension.extensions.forEach((extension, index) => {
        if (extension.className === 'GettingStartedUiExtensionIn') {
            extension.gettingStartedUrl = gettingStartedUrl(req.organizationSecret.serverUrl, application.name, application.id)
            installInfo.uiExtension.extensions[index] = extension
        }
    })
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
