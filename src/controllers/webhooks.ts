import { Request, Response } from 'express'

import { ApplicationUninstalledPayload, ChangeServerUrlPayload, InitPayload } from '@/types/space'
import { getInstallInfo, gettingStartedUrl } from '@/utils/version'
import { getApplication, sync } from '@/libs/space'
import { OrganizationModel } from '@/models'

export async function install(req: Request, res: Response) {
    const body = req.body as InitPayload
    const installInfo = getInstallInfo()
    const application = await getApplication(req.organizationSecret)
    installInfo.uiExtension.extensions.forEach((extension, index) => {
        if (extension.className === 'GettingStartedUiExtensionIn') {
            extension.gettingStartedUrl = gettingStartedUrl(req.organizationSecret.serverUrl, application.name, application.id)
            installInfo.uiExtension.extensions[index] = extension
        }
    })
    await sync(req.organizationSecret, installInfo)
    await OrganizationModel.create({
        clientId: body.clientId,
        clientSecret: body.clientSecret,
        serverUrl: body.serverUrl,
        admin: [body.userId],
        version: installInfo.version,
    })
    res.status(204).send()
}

export async function updateServerUrl(req: Request, res: Response) {
    const body = req.body as ChangeServerUrlPayload
    await OrganizationModel.updateServerUrlByClientId(body.clientId, body.newServerUrl)
    res.status(204).send()
}

export async function uninstall(req: Request, res: Response) {
    const body = req.body as ApplicationUninstalledPayload
    await OrganizationModel.deleteByClientId(body.clientId)
    res.status(204).send()
}
