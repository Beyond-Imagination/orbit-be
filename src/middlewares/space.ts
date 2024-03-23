import { NextFunction, Request, RequestHandler, Response } from 'express'
import crypto from 'crypto'
import jwkToPem from 'jwk-to-pem'

import { InvalidClassName, Unauthorized } from '@/types/errors'
import { OrganizationModel, OrganizationSecret } from '@/models'
import { getPublicKeys, getUserProfile, sendInvalidCommandMessage } from '@/services/space'

export const classNameValidator = (className: string): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (className === req.body.className) {
            next()
        } else {
            next(new InvalidClassName())
        }
    }
}

export const classNameRouter = (req: Request, res: Response, next: NextFunction) => {
    switch (req.body.className) {
        case 'InitPayload':
            req.url = '/v1/webhooks/install'
            req.method = 'POST'
            break
        case 'ChangeServerUrlPayload':
            req.url = '/v1/webhooks/changeServerUrl'
            req.method = 'PUT'
            break
        case 'ApplicationUninstalledPayload':
            req.url = '/v1/webhooks/uninstall'
            req.method = 'DELETE'
            break
        case 'ListCommandsPayload':
            req.url = '/v1/commands/list'
            req.method = 'GET'
            break
        case 'MessagePayload':
            break
        case 'MessageActionPayload':
            break
        case 'AppPublicationCheckPayload':
            res.sendStatus(200)
            return
    }
    res.meta.path = req.url
    res.meta.method = req.method
    next()
}

export const messageCommandRouter = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.className === 'MessagePayload') {
        const commands = req.body.message.body.text.split(' ')
        switch (commands[0]) {
            case 'add':
                req.url = '/v1/commands/orbit'
                req.method = 'POST'
                break
            case 'list':
                req.url = '/v1/commands/orbit'
                req.method = 'GET'
                break
            case 'help':
                req.url = '/v1/commands/help'
                req.method = 'GET'
                break
            default: {
                const organization = await OrganizationModel.findByClientId(req.body.clientId)
                await sendInvalidCommandMessage(organization, req.body.userId)
                res.sendStatus(204)
                return
            }
        }
        res.meta.path = req.url
        res.meta.method = req.method
    }
    next()
}

export function actionRouter(req: Request, res: Response, next: NextFunction) {
    if (req.body.className === 'MessageActionPayload') {
        switch (req.body.actionId) {
            case 'delete':
                req.url = '/v1/commands/orbit'
                req.method = 'DELETE'
                break
            default:
                res.sendStatus(500)
                return
        }
        res.meta.path = req.url
        res.meta.method = req.method
    }
    next()
}

export async function setOrganization(req: Request, res: Response, next: NextFunction) {
    if (req.body.className === 'InitPayload') {
        req.organizationSecret = new OrganizationSecret(req.body.clientId, req.body.clientSecret, req.body.serverUrl)
    } else if (req.body.clientId) {
        const organization = await OrganizationModel.findByClientId(req.body.clientId)
        req.organization = organization
        req.organizationSecret = organization
    } else if (req.query.serverUrl || req.body.serverUrl) {
        const serverUrl: string = (req.query.serverUrl as string) || req.body.serverUrl
        const organization = await OrganizationModel.findByServerUrl(serverUrl)
        req.organization = organization
        req.organizationSecret = organization
    }
    next()
}

async function verifySignature(req: Request, res: Response, next: NextFunction) {
    const signature = req.headers['x-space-public-key-signature'].toString()
    const data = `${req.headers['x-space-timestamp']}:${JSON.stringify(req.body)}`

    const publicKeys = await getPublicKeys(req.organizationSecret, await req.organizationSecret.getBearerToken())
    for (const publicKey of publicKeys.keys.reverse()) {
        const key = jwkToPem(publicKey)
        const verified = crypto.verify(
            'SHA512',
            Buffer.from(data),
            {
                key: key,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(signature, 'base64'),
        )

        if (verified) {
            return next()
        }
    }

    next(new Unauthorized('fail to verify public key'))
}

export const verifySpaceRequest = [setOrganization, verifySignature]

async function verifyUser(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')
    const secret = req.organizationSecret

    const profile = await getUserProfile(token, secret)

    req.user = profile

    next()
}

export const verifyUserRequest = [setOrganization, verifyUser]
