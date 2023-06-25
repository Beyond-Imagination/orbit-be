import '@config'
import newrelic from 'newrelic'
import connect from '@models/connector'
import API from '@/api'
import Messenger from '@/messenger'
import Scheduler from '@/scheduler'
;(async () => {
    await connect()
    const api = new API(newrelic)
    const messenger = new Messenger()
    const scheduler = new Scheduler(messenger)
    scheduler.run()
    api.listen()
})()
