import '@config'
import { API } from '@/api'
import Messenger from '@/messenger'
import Scheduler from '@/scheduler'

;(async () => {
    const api = new API()
    const messenger = new Messenger()
    const scheduler = new Scheduler(messenger)
    scheduler.run()
    api.listen()
})()
