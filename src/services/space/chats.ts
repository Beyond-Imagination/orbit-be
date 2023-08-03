import fetch from 'node-fetch'
import moment from 'moment-timezone'

import { Orbit, Organization } from '@/models'
import { ChatMessage, MessageDivider, MessageSection } from '@types/space'
import { logger } from '@utils/logger'
import { MAX_ORBIT_COUNT } from '@config'

async function sendMessage(organization: Organization, message: ChatMessage) {
    const url = `${organization.serverUrl}/api/http/chats/messages/send-message`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: await organization.getBearerToken(),
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
    if (!response.ok) {
        logger.error('fail to send message', { serverUrl: organization.serverUrl, cause: await response.text() })
    }
}

export async function sendTextMessage(organization: Organization, userId: string, text: string) {
    const message: ChatMessage = {
        channel: `member:id:${userId}`,
        content: {
            className: 'ChatMessage.Text',
            text: text,
        },
    }
    await sendMessage(organization, message)
}

export async function sendHelpMessage(organization: Organization, userId: string) {
    const message: ChatMessage = {
        channel: `member:id:${userId}`,
        content: {
            className: 'ChatMessage.Block',
            sections: [
                {
                    className: 'MessageSection',
                    elements: [
                        {
                            className: 'MessageText',
                            content: 'add command help message',
                            accessory: {
                                className: 'MessageIcon',
                                icon: {
                                    icon: 'help',
                                },
                            },
                        },
                        {
                            className: 'MessageFields',
                            fields: [
                                {
                                    className: 'MessageField',
                                    first: 'format',
                                    second: 'add {channel_name} "{cron} {timezone}" "{message}"',
                                },
                                {
                                    className: 'MessageField',
                                    first: 'example',
                                    second: 'add my_channel "* * * * * Asia/Seoul" "welcome to orbit"',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    }
    await sendMessage(organization, message)
}

export async function sendAddSuccessMessage(organization: Organization, userId: string) {
    await sendTextMessage(organization, userId, 'a new orbit message added')
}

export async function sendAddFailMessage(organization: Organization, userId: string) {
    await sendTextMessage(organization, userId, 'fail to add a new orbit message. check your command')
}

export async function sendAddErrorMessage(organization: Organization, userId: string) {
    await sendTextMessage(
        organization,
        userId,
        `fail to add a new orbit message. Only up to ${MAX_ORBIT_COUNT} messages can be registered per organization.`,
    )
}

export async function sendOrbitListMessage(organization: Organization, userId: string, orbits: Orbit[]) {
    const sections = orbits.map<MessageSection | MessageDivider>(orbit => ({
        className: 'MessageSection',
        elements: [
            {
                className: 'MessageFields',
                fields: [
                    {
                        className: 'MessageField',
                        first: 'Channel Name',
                        second: orbit.channelName,
                    },
                    {
                        className: 'MessageField',
                        first: 'cron',
                        second: `\`${orbit.cron}\``,
                    },
                    {
                        className: 'MessageField',
                        first: 'timezone',
                        second: orbit.timezone,
                    },
                    {
                        className: 'MessageField',
                        first: 'message',
                        second: orbit.message,
                    },
                    {
                        className: 'MessageField',
                        first: 'created at',
                        second: moment.tz(orbit.createdAt, orbit.timezone).format('YYYY-MM-DD HH:mm:ss'),
                    },
                ],
            },
            {
                className: 'MessageControlGroup',
                elements: [
                    {
                        className: 'MessageButton',
                        text: 'delete',
                        style: 'DANGER',
                        action: {
                            className: 'PostMessageAction',
                            actionId: 'delete',
                            payload: orbit._id.toString(),
                        },
                    },
                ],
            },
        ],
    }))

    const message: ChatMessage = {
        channel: `member:id:${userId}`,
        content: {
            className: 'ChatMessage.Block',
            sections: sections,
        },
    }
    await sendMessage(organization, message)
}

export async function sendEmptyOrbitListMessage(organization: Organization, userId: string) {
    await sendTextMessage(organization, userId, 'no orbit message')
}

export async function sendDeleteSuccessMessage(organization: Organization, userId: string) {
    await sendTextMessage(organization, userId, 'the orbit message deleted')
}

export async function sendDeleteFailMessage(organization: Organization, userId: string) {
    await sendTextMessage(organization, userId, 'fail to delete the orbit message')
}

export async function sendChannelMessage(organization: Organization, channelName: string, text: string) {
    const message: ChatMessage = {
        channel: `channel:name:${channelName}`,
        content: {
            className: 'ChatMessage.Text',
            text: text,
        },
    }
    await sendMessage(organization, message)
}
