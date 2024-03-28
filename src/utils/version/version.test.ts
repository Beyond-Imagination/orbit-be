import { getInstallInfo } from '@/utils/version'
import { errors } from '@/types'

import v010 from '@/utils/version/v0.1.0'
import v030 from '@/utils/version/v0.3.0'
import v040 from '@/utils/version/v0.4.0'
import v050 from '@/utils/version/v0.5.0'

describe('space install version', () => {
    it('should get v0.1.0', () => {
        expect(getInstallInfo('0.1.0')).toStrictEqual(v010)
    })

    it('should get v0.3.0', () => {
        expect(getInstallInfo('0.3.0')).toStrictEqual(v030)
    })

    it('should get v0.4.0', () => {
        expect(getInstallInfo('0.4.0')).toStrictEqual(v040)
    })

    it('should get v0.5.0', () => {
        expect(getInstallInfo('0.5.0')).toStrictEqual(v050)
    })

    it('should get latest', () => {
        expect(getInstallInfo()).toStrictEqual(v050)
    })

    it('should throw error with unknown version', () => {
        expect(() => getInstallInfo('1.0.0')).toThrowError(errors.InvalidVersion)
    })
})
