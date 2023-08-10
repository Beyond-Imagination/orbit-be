import newrelic from 'newrelic'
import schedule from 'node-schedule'

import { OrbitModel, OrganizationModel } from '@/models'
import { logger } from '@utils/logger'

export default class Metric {
    private async orbitCount() {
        const count = (await OrbitModel.estimatedDocumentCount()) as number
        newrelic.recordMetric('orbit/count', count)
    }

    private async organizationCount() {
        const count = (await OrganizationModel.estimatedDocumentCount()) as number
        newrelic.recordMetric('organization/count', count)
    }

    public run() {
        schedule.scheduleJob('0 0 * * *', async () => {
            try {
                await this.orbitCount()
                await this.organizationCount()
            } catch (e) {
                logger.error('metric record fail', { error: e })
            }
        })
    }

    public async stop() {
        await schedule.gracefulShutdown() // wait finish current job
    }
}
