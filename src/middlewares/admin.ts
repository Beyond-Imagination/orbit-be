import { NextFunction, Request, Response } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'

import { AdminNotFoundException, InvalidJWTException, AdminNotApprovedException } from '@/types/errors/admin'
import { Admin, AdminModel } from '@models/admin'
import { SECRET_KEY } from '@config'
import { checkTokenIsRevoked } from '@utils/blacklist'

export async function jwtVerifyMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.header('authorization').startsWith('bearer ')) {
            throw new Error('not bearer token')
        }

        const token = req.header('authorization')
        if (checkTokenIsRevoked(token)) {
            throw new Error('revoked token')
        }

        // verify 이전에 'bearer'와 같은 prefix가 제거되어야한다.
        const jsonwebtoken = token.split(' ')[1]
        const decoded = verify(jsonwebtoken, SECRET_KEY)
        req.jwtPayload = decoded as JwtPayload
    } catch (e) {
        throw new InvalidJWTException(e)
    }
    next()
}

export async function verifyAdminMiddleware(req: Request, res: Response, next: NextFunction) {
    const username = req.jwtPayload.username
    const admin: Admin = await AdminModel.findByUsername(username)
    if (!admin) {
        throw new AdminNotFoundException()
    } else if (!admin.hasApproved) {
        throw new AdminNotApprovedException()
    }
    req.admin = admin
    next()
}

export const verifyAdminRequest = [jwtVerifyMiddleware, verifyAdminMiddleware]
