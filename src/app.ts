import '@config'
import newrelic from 'newrelic'
import connect from '@models/connector'
import API from '@/api'
import Messenger from '@/messenger'
import Scheduler from '@/scheduler'
import { logger } from '@utils/logger'
;(async () => {
    await connect()
    const api = new API(newrelic)
    const messenger = new Messenger()
    const scheduler = new Scheduler(messenger)
    scheduler.run()
    api.listen()

    async function shutdown() {
        logger.info('gracefully shutdown orbit')
        await Promise.all([api.close, scheduler.stop])
        logger.info('shutdown complete')
        process.exit()
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
})()
