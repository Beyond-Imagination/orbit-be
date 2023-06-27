import http from 'http'
import express from 'express'
import compression from 'compression'
import hpp from 'hpp'
import helmet from 'helmet'

import { isProduction, NODE_ENV, PORT } from '@config'
import { logger, loggerMiddleware } from '@utils/logger'
import controllers from '@controllers'
import middlewares from '@middlewares'

export default class API {
    app: express.Application
    server: http.Server

    constructor(newrelic: any) {
        this.app = express()

        this.app.locals.newrelic = newrelic

        this.setPreMiddleware()
        this.setController()
        this.setPostMiddleware()
    }

    setPreMiddleware() {
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(hpp())
        this.app.use(middlewares.request.requestId)
        this.app.use(loggerMiddleware)
        this.app.use(middlewares.space.classNameRouter)
        this.app.use(middlewares.space.messageCommandRouter)
        this.app.use(middlewares.space.actionRouter)
    }

    setController() {
        this.app.use('/v1/webhooks', controllers.v1.webhooks)
        this.app.use('/v1/commands', controllers.v1.commands)
        this.app.use('/v1/orbits', controllers.v1.orbit)
        if (!isProduction()) {
            this.app.use('/dev', controllers.dev)
        }
    }

    setPostMiddleware() {
        this.app.use(middlewares.error)
    }

    public listen() {
        this.server = this.app.listen(PORT, () => {
            logger.info(`🚀 App listening on the port: ${PORT} ENV: ${NODE_ENV}`)
        })
    }

    public async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.close(() => {
                resolve()
            })
        })
    }
}
