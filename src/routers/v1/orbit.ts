import express, { Router } from 'express'
import asyncify from 'express-asyncify'

import * as middlewares from '@/middlewares'
import { createOrbit, deleteOrbit, getOrbits, sendOrbitMessage, updateOrbit } from '@/controllers/orbits'

const router: Router = asyncify(express.Router())

router.get('/', middlewares.space.verifyUserRequest, getOrbits)

router.post('/', middlewares.space.verifyUserRequest, middlewares.orbit.verifyPostMessage, middlewares.orbit.orbitMaxCountLimiter, createOrbit)

router.put('/:id', middlewares.space.verifyUserRequest, updateOrbit)

router.delete('/:id', middlewares.space.verifyUserRequest, deleteOrbit)

router.post('/:id/send', middlewares.space.verifyUserRequest, sendOrbitMessage)

export default router
