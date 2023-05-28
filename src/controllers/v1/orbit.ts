import express from 'express'
import asyncify from 'express-asyncify'

const router = asyncify(express.Router())

router.get('/', (req, res) => {
    res.status(200).json({ path: 'orbit' })
})

export default router
