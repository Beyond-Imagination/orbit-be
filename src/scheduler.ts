import fastq, { queueAsPromised } from 'fastq'
import schedule from 'node-schedule'

import Messenger from '@/messenger'
import { logger } from '@utils/logger'
import { OrbitModel } from '@/models'

export default class Scheduler {
    queue: queueAsPromised

    constructor(messenger: Messenger) {
        this.queue = fastq.promise(messenger.handler, 5)
    }

    private async publish() {
        logger.info('run publisher')

        const targetList = await OrbitModel.findByExecutionTime()
        targetList.forEach(target => {
            this.queue.push(target)
        })
    }

    public run() {
        schedule.scheduleJob('* * * * *', async () => await this.publish())
    }
}
