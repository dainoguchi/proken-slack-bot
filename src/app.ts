import { App } from '@slack/bolt'
import { config } from 'dotenv'

config()

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
})