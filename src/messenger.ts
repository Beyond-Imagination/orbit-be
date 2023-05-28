import { logger } from '@utils/logger'

export default class Messenger {
    public async handler(arg: any) {
        logger.info('messenger.handler called', { arg })

        // TODO: message 전송 로직 추가
    }
}
