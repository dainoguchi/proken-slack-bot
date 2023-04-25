import { App, ExpressReceiver } from '@slack/bolt'
import { config } from 'dotenv'
import express from 'express'

config()

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
})

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
})
const server = express()
const port = process.env.PORT || 3000

server.use(express.urlencoded({ extended: true }))
server.use(express.json())

server.use('/slack/events', receiver.router)
server.use('/slack/commands', receiver.router)
server.use('/slack/actions', receiver.router)
server.use('/slack/shortcuts', receiver.router)
server.use('/slack/modals', receiver.router)

server.listen(port, () => {
  console.log(`⚡️ Bolt app is running on port ${port}!`)
})
