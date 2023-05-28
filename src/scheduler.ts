import fastq, { queueAsPromised } from 'fastq'
import schedule from 'node-schedule'

import Messenger from '@/messenger'
import { logger } from '@utils/logger'

export default class Scheduler {
    queue: queueAsPromised

    constructor(messenger: Messenger) {
        this.queue = fastq.promise(messenger.handler, 5)
    }

    private async publish() {
        logger.info('run publisher')

        // TODO: db 에서 현재 message 대상 목록을 가져와 queue 에 push

        // 임시 코드
        for (let i = 0; i < 5; i++) {
            this.queue.push(i)
        }
    }

    public run() {
        schedule.scheduleJob('* * * * *', async () => await this.publish())
    }
}
