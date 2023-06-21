import { logger } from '@utils/logger'

export default class Messenger {
    public async handler(arg: any) {
        logger.info('messenger.handler called', { arg })

        // TODO: message 전송 로직 추가
        // 처리해야하는 메세지들에 대해서 메세지 전송 로직이 필요하다.
    }
}
