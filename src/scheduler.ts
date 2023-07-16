import fastq, { queueAsPromised } from 'fastq'
import schedule from 'node-schedule'
import newrelic from 'newrelic'

import Messenger from '@/messenger'
import { OrbitModel } from '@/models'
import { MESSENGER_CONCURRENCY } from '@config'

export default class Scheduler {
    queue: queueAsPromised

    constructor(messenger: Messenger) {
        this.queue = fastq.promise(messenger.handler, MESSENGER_CONCURRENCY)
    }

    private async publish() {
        newrelic.incrementMetric('scheduler')
        await newrelic.startBackgroundTransaction('scheduler', async () => {
            const now = new Date()
            let page = 1
            while (page) {
                const orbits = await OrbitModel.findByExecutionTime(page, now)
                for (const orbit of orbits.docs) {
                    this.queue.push(orbit)
                }

                page = orbits.nextPage
            }
        })
    }

    public run() {
        schedule.scheduleJob('* * * * *', async () => await this.publish())
    }

    public async stop() {
        await schedule.gracefulShutdown() // wait finish current job
        await this.queue.drained() // wait until last item in the queue is processed
    }
}
