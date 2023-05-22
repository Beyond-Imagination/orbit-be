import express from 'express'
import {InternalServerError} from "@/types/errors";

const router = express.Router()

router.get('/error', (req, res) => {
    throw new InternalServerError()
})

export default router
