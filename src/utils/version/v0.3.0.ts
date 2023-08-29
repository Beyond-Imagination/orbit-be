import { installInfo } from '@/types'
import { CLIENT_URL } from '@config'

import v010 from '@utils/version/v0.1.0'

const data: installInfo = {
    version: '0.3.0',
    uiExtension: {
        contextIdentifier: v010.uiExtension.contextIdentifier,
        extensions: [
            ...v010.uiExtension.extensions,
            {
                className: 'ApplicationHomepageUiExtensionIn',
                iframeUrl: CLIENT_URL,
            },
        ],
    },
    right: v010.right,
}

export default data
