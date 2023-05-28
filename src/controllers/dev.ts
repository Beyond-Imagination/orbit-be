import express from 'express'
import asyncify from 'express-asyncify'

import { InternalServerError } from '@/types/errors'

const router = asyncify(express.Router())

router.get('/error', async (req, res) => {
    throw new InternalServerError()
})

export default router
