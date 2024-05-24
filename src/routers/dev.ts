import express, { Router } from 'express'
import asyncify from 'express-asyncify'

import { InternalServerError } from '@/types/errors'
import { OrbitModel } from '@/models'

const router: Router = asyncify(express.Router())

router.get('/error', async (req, res) => {
    throw new InternalServerError()
})

router.get('/orbit', async (req, res) => {
    const result = await OrbitModel.find().populate('organization').exec()
    res.status(200).send(result)
})

export default router
