import express, { Router } from 'express'
import asyncify from 'express-asyncify'

import * as middlewares from '@/middlewares'
import { install, uninstall, updateServerUrl } from '@/controllers/webhooks'

const router: Router = asyncify(express.Router())

router.use(middlewares.space.verifySpaceRequest)

router.post('/install', install)

router.put('/changeServerUrl', updateServerUrl)

router.delete('/uninstall', uninstall)

export default router
