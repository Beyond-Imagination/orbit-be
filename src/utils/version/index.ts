import { installInfo, errors } from '@/types'

import v010 from './v0.1.0'
import v030 from './v0.3.0'

const version = {
    '0.1.0': v010,
    '0.3.0': v030,
    latest: v030,
}

export function getInstallInfo(targetVersion = 'latest'): installInfo {
    if (targetVersion in version) {
        return version[targetVersion]
    }
    throw new errors.InvalidVersion()
}
