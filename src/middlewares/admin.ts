import { NextFunction, Request, Response } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'

import { AdminNotFoundException, InvalidJWTException, AdminNotApprovedException } from '@/types/errors/admin'
import { Admin, AdminModel } from '@models/admin'
import { SECRET_KEY } from '@config'

export async function jwtVerifyMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.header('authorization')
        if (!token.startsWith('bearer ')) {
            throw new Error('not bearer token')
        }
        token = token.slice('bearer '.length)
        const decoded = verify(token, SECRET_KEY)
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
