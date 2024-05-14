import fetch from 'node-fetch'

import { errors, installInfo, space } from '@/types'

export async function sync(secret: space.IOrganizationSecret, installInfo: installInfo) {
    await Promise.all([setUIExtension(secret, installInfo), requestRights(secret, installInfo)])
}

export async function setUIExtension(secret: space.IOrganizationSecret, installInfo: installInfo): Promise<void> {
    const url = `${secret.serverUrl}/api/http/applications/ui-extensions`
    const body = JSON.stringify(installInfo.uiExtension)
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: await secret.getBearerToken(),
        },
        body: body,
    })
    if (!response.ok) {
        throw new errors.ErrorSetUiExtension(await response.text())
    }
    return
}

export async function requestRights(secret: space.IOrganizationSecret, installInfo: installInfo): Promise<void> {
    const url = `${secret.serverUrl}/api/http/applications/clientId:${secret.clientId}/authorizations/authorized-rights/request-rights`
    const body = JSON.stringify(installInfo.right)
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: await secret.getBearerToken(),
        },
        body: body,
    })
    if (!response.ok) {
        throw new errors.ErrorRequestRights(await response.text())
    }
    return
}
