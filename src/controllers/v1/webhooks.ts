import express from 'express'
import asyncify from "express-asyncify";

const router = asyncify(express.Router())

router.get('/', (req, res) => {
    res.status(200).json({path: 'webhooks' })
})

router.post('/install', async (req, res) => {
    res.status(204).send()
})

router.put('/changeServerUrl', async (req, res) => {
    res.status(204).send()
})

router.delete('/uninstall', async (req, res) => {
    res.status(204).send()
})

export default router
