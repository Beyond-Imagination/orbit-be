import newrelic from 'newrelic'

import { sendChannelMessage } from '@/services/space'
import { Orbit, Organization } from '@/models'
import { logger } from '@/utils/logger'

export default class Messenger {
    public async handler(orbit: Orbit) {
        try {
            newrelic.incrementMetric('messenger')
            // 실제로 사용자에게 메시지를 전송하는 부분
            const organization = orbit.organization as Organization
            const result = await sendChannelMessage(organization, orbit.channelName, orbit.message)
            await orbit.updateStatus(result)

            // 다음 메세지 큐에 들어가는 element 를 선별하기 위함
            await orbit.updateNextExecutionTime()
        } catch (e) {
            logger.error('messenger fail', { error: e, messageId: orbit._id })
            await orbit.updateStatus(false)
        }
    }
}
