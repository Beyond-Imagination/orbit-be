import '@config'
import newrelic from 'newrelic'
import * as db from '@models/connector'
import API from '@/api'
import Messenger from '@/messenger'
import Scheduler from '@/scheduler'
import Metric from '@/metric'
import { logger } from '@utils/logger'
;(async () => {
    await db.connect()
    const api = new API(newrelic)
    const messenger = new Messenger()
    const scheduler = new Scheduler(messenger)
    const metric = new Metric()
    scheduler.run()
    metric.run()
    api.listen()

    async function shutdown() {
        logger.info('gracefully shutdown orbit')
        await Promise.all([api.close, scheduler.stop, metric.stop])
        await db.close()
        logger.info('shutdown complete')
        process.exit()
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
})()
