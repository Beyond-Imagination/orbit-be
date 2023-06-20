import { getMockReq, getMockRes } from '@jest-mock/express'

import { addCommandValidator, addRegex } from '@/middlewares/commands'

jest.mock('@services/space', () => ({
    sendAddFailMessage: jest.fn(),
}))

describe('addRegex', () => {
    it('should parse valid command', () => {
        const text = 'add test "* * * * *" "this is a test"'
        const [command, channelName, cron, message, ...rest] = text.match(addRegex)
        expect(command).toBe('add')
        expect(channelName).toBe('test')
        expect(cron).toBe('"* * * * *"')
        expect(message).toBe('"this is a test"')
        expect(rest).toHaveLength(0)
    })

    it('should parse undefined with incomplete command', () => {
        const text = 'add'
        const [command, channelName, cron, message, ...rest] = text.match(addRegex)
        expect(command).toBe('add')
        expect(channelName).toBeUndefined()
        expect(cron).toBeUndefined()
        expect(message).toBeUndefined()
        expect(rest).toHaveLength(0)
    })

    it('should parse rest with too much command', () => {
        const text = 'add test "* * * * *" "this is a test" with too much commands'
        const [command, channelName, cron, message, ...rest] = text.match(addRegex)
        expect(command).toBe('add')
        expect(channelName).toBe('test')
        expect(cron).toBe('"* * * * *"')
        expect(message).toBe('"this is a test"')
        expect(rest.length).toBeGreaterThan(0)
    })
})

describe('addCommandValidator', () => {
    it('should success with valid command', async () => {
        const req = getMockReq({ body: { message: { body: { text: 'add test "* * * * *" "this is a test"' } } } })
        const { res, next } = getMockRes({})

        await addCommandValidator(req, res, next)
        expect(req.command).toBeTruthy()
        expect(next).toBeCalledTimes(1)
    })

    describe('command', () => {
        it('should send result only with command', async () => {
            const req = getMockReq({ body: { message: { body: { text: 'add' } } } })
            const { res, next } = getMockRes({})

            await addCommandValidator(req, res, next)
            expect(req.command).toBeUndefined()
            expect(next).toBeCalledTimes(0)
            expect(res.sendStatus).toBeCalledWith(204)
        })
    })

    describe('channel name', () => {
        it('should send result only with command and channelName', async () => {
            const req = getMockReq({ body: { message: { body: { text: 'add channelName' } } } })
            const { res, next } = getMockRes({})

            await addCommandValidator(req, res, next)
            expect(req.command).toBeUndefined()
            expect(next).toBeCalledTimes(0)
            expect(res.sendStatus).toBeCalledWith(204)
        })
    })

    describe('cron', () => {
        it('should send result with invalid cron', async () => {
            const req = getMockReq({ body: { message: { body: { text: 'add channelName "invalid cron" "message"' } } } })
            const { res, next } = getMockRes({})

            await addCommandValidator(req, res, next)
            expect(req.command).toBeUndefined()
            expect(next).toBeCalledTimes(0)
            expect(res.sendStatus).toBeCalledWith(204)
        })
    })

    describe('message', () => {
        it('should send result without message', async () => {
            const req = getMockReq({ body: { message: { body: { text: 'add channelName "* * * * *"' } } } })
            const { res, next } = getMockRes({})

            await addCommandValidator(req, res, next)
            expect(req.command).toBeUndefined()
            expect(next).toBeCalledTimes(0)
            expect(res.sendStatus).toBeCalledWith(204)
        })
    })

    describe('rest', () => {
        it('should send result with too much command', async () => {
            const req = getMockReq({ body: { message: { body: { text: 'add channelName "* * * * *" "message" with too much command' } } } })
            const { res, next } = getMockRes({})

            await addCommandValidator(req, res, next)
            expect(req.command).toBeUndefined()
            expect(next).toBeCalledTimes(0)
            expect(res.sendStatus).toBeCalledWith(204)
        })
    })
})
