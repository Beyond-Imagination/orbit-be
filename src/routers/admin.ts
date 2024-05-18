import express, { Router } from 'express'
import asyncify from 'express-asyncify'

import * as middlewares from '@/middlewares'
import { approveAdmin, loginAdmin, logoutAdmin, registerAdmin, updateOrganization } from '@/controllers/admin'

const router: Router = asyncify(express.Router())

router.post('/register', registerAdmin)

router.post('/login', loginAdmin)

router.post('/logout', middlewares.admin.verifyAdminRequest, logoutAdmin)

router.post('/approve', middlewares.admin.verifyAdminRequest, approveAdmin)

router.patch('/organization/version', middlewares.admin.verifyAdminRequest, middlewares.space.setOrganization, updateOrganization)

export default router
