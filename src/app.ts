import { App } from '@slack/bolt'

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,

  // ローカルで動かす場合はsocketModeをtrueにする
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
})
