import newrelic from 'newrelic'

import { sendChannelMessage } from '@services/space'
import { Orbit, Organization } from '@/models'
import { logger } from '@utils/logger'

export default class Messenger {
    public async handler(arg: Orbit) {
        try {
            newrelic.incrementMetric('messenger')
            // 실제로 사용자에게 메시지를 전송하는 부분
            const { organization } = { organization: arg.organization } as { organization: Organization }
            const result = await sendChannelMessage(organization, arg.channelName, arg.message)
            await arg.updateStatus(result)

            // 다음 메세지 큐에 들어가는 element를 선별하기 위함
            await arg.updateNextExecutionTime()
        } catch (e) {
            logger.error('messenger fail', { error: e, messageId: arg._id })
            await arg.updateStatus(false)
        }
    }
}
