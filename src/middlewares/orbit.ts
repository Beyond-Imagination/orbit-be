import { NextFunction, Request, Response } from 'express'
import cronParser from 'cron-parser'

import { errors, orbit } from '@/types'
import { Orbit, OrbitModel } from '@/models'
import { MAX_ORBIT_COUNT } from '@/config'
import { sendAddErrorMessage } from '@/libs/space'

export async function orbitMaxCountLimiter(req: Request, res: Response, next: NextFunction) {
    const orbitMessages: Orbit[] = await OrbitModel.findByClientId(req.organization.clientId)
    if (orbitMessages.length >= MAX_ORBIT_COUNT) {
        if (req.body.userId) {
            await sendAddErrorMessage(req.organization, req.body.userId)
        }
        return next(new errors.MaxOrbitMessage())
    }
    next()
}

export async function verifyPostMessage(req: Request, res: Response, next: NextFunction) {
    // body에 존재하는 사용자 입력을 필터링, 이 후 검증
    const SUPPORTED_FORMATS = ['cron', 'weekly']

    const body = req.body as orbit.PostOrbitRequest

    const { channelName, type, message, cron, timezone } = body

    if (!message) {
        return next(new errors.BadRequest())
    }
    if (!channelName) {
        // todo: check if channelName exist
        return next(new errors.BadRequest())
    }

    if (!timezone) {
        // todo: check if the timezone is valid
        return next(new errors.BadRequest())
    }

    if (!type || !SUPPORTED_FORMATS.includes(type)) {
        return next(new errors.BadRequest())
    }

    if (type === 'cron') {
        const cronLength = cron?.split(' ').length
        if (!cron || cronLength !== 5) {
            return next(new errors.BadRequest())
        }
        try {
            cronParser.parseExpression(cron)
        } catch (e) {
            return next(new errors.BadRequest())
        }
    } else if (type === 'weekly') {
        if (!body.weekly || !body.weekly.days || !body.weekly.time) {
            return next(new errors.BadRequest())
        }
        if (!body.weekly.days.length) {
            return next(new errors.BadRequest())
        }
    }
    next()
}
