import fastq, { queueAsPromised } from 'fastq'
import schedule from 'node-schedule'

import Messenger from '@/messenger'
import { logger } from '@utils/logger'
import { OrbitModel } from '@/models'
import { MESSENGER_CONCURRENCY } from '@config'

export default class Scheduler {
    queue: queueAsPromised

    constructor(messenger: Messenger) {
        this.queue = fastq.promise(messenger.handler, MESSENGER_CONCURRENCY)
    }

    private async publish() {
        logger.info('run publisher')

        const now = new Date()
        let page = 1
        while (page) {
            const orbits = await OrbitModel.findByExecutionTime(page, now)
            for (const orbit of orbits.docs) {
                await this.queue.push(orbit)
            }

            page = orbits.nextPage
        }
    }

    public run() {
        schedule.scheduleJob('* * * * *', async () => await this.publish())
    }

    public async stop() {
        await schedule.gracefulShutdown() // wait finish current job
        await this.queue.drained() // wait until last item in the queue is processed
    }
}
