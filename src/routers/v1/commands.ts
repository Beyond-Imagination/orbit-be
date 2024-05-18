import express, { NextFunction, Request, Response, Router } from 'express'
import asyncify from 'express-asyncify'

import * as middlewares from '@/middlewares'
import { list, help, createOrbitCommand, getOrbitCommand, deleteOrbitCommand } from '@/controllers/commands'

const router: Router = asyncify(express.Router())

router.use(middlewares.space.verifySpaceRequest)

router.get('/list', list)

router.get('/help', help)

router.post('/orbit', middlewares.commands.addCommandValidator, middlewares.orbit.orbitMaxCountLimiter, createOrbitCommand)

router.get('/orbit', getOrbitCommand)

router.delete(
    '/orbit',
    (req: Request, res: Response, next: NextFunction) => {
        req._routeBlacklists.body = ['message']
        next()
    },
    deleteOrbitCommand,
)

export default router
