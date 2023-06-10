import { NextFunction, Request, RequestHandler, Response } from 'express'
import crypto from 'crypto'
import jwkToPem from 'jwk-to-pem'

import { InvalidClassName, Unauthorized } from '@/types/errors'
import { OrganizationModel } from '@/models'
import { getAccessToken, getPublicKeys } from '@services/space'

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
            req.method = 'post'
            break
        case 'ChangeServerUrlPayload':
            req.url = '/v1/webhooks/changeServerUrl'
            req.method = 'put'
            break
        case 'ApplicationUninstalledPayload':
            req.url = '/v1/webhooks/uninstall'
            req.method = 'delete'
            break
        case 'ListCommandsPayload':
            req.url = '/v1/commands/list'
            req.method = 'get'
            break
        case 'MessagePayload':
            req.url = '/v1/commands'
            req.method = 'post'
            break
    }
    res.meta.path = req.url
    next()
}

export const commandRouter = (req, res, next) => {
    const commands = req.body.message.body.text.split(' ')
    switch (commands[0]) {
        case 'add':
            req.url = '/orbit'
            req.method = 'post'
            break
        case 'list':
            req.url = '/orbit'
            req.method = 'get'
            break
        case 'update':
            req.url = '/orbit'
            req.method = 'put'
            break
        case 'delete':
            req.url = '/orbit'
            req.method = 'delete'
            break
    }
    res.meta.path += req.url
    next()
}

async function setOrganization(req: Request, res: Response, next: NextFunction) {
    if (req.body.className === 'InitPayload') {
        req.organizationSecret = {
            clientId: req.body.clientId,
            clientSecret: req.body.clientSecret,
            serverUrl: req.body.serverUrl,
        }
    } else if (req.body.clientId) {
        const organization = await OrganizationModel.findByClientId(req.body.clientId)
        req.organization = organization
        req.organizationSecret = organization
    }
    next()
}

async function setBearerToken(req: Request, res: Response, next: NextFunction) {
    const result = await getAccessToken(req.organizationSecret)
    req.bearerToken = `Bearer ${result.access_token}`
    next()
}

async function verifySignature(req: Request, res: Response, next: NextFunction) {
    const signature = req.headers['x-space-public-key-signature'].toString()
    const data = `${req.headers['x-space-timestamp']}:${JSON.stringify(req.body)}`

    const publicKeys = await getPublicKeys(req.organizationSecret, req.bearerToken)
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

export const verifySpaceRequest = [setOrganization, setBearerToken, verifySignature]
