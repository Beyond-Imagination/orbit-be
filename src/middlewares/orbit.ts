import { NextFunction, Request, Response } from 'express'
import { BadRequest } from '@types/errors'
import { PostOrbitRequest } from '@types/orbit'
import cronParser from 'cron-parser'

export async function verifyPostMessage(req: Request, res: Response, next: NextFunction) {
    // body에 존재하는 사용자 입력을 필터링, 이 후 검증
    const SUPPORTED_FORMATS = ['cron']

    const body = req.body as PostOrbitRequest

    const { channelName, format, message, cron, timezone } = body

    if (!message) {
        return next(new BadRequest())
    }
    if (!channelName) {
        // todo: check if channelName exist
        return next(new BadRequest())
    }

    if (!timezone) {
        // todo: check if the timezone is valid
        return next(new BadRequest())
    }

    if (!format || !SUPPORTED_FORMATS.includes(format)) {
        return next(new BadRequest())
    }

    const cronLength = cron?.split(' ').length
    if (!cron || cronLength !== 5) {
        return next(new BadRequest())
    }
    try {
        cronParser.parseExpression(cron)
    } catch (e) {
        return next(new BadRequest())
    }
    next()
}
