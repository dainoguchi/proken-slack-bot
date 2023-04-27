import { View } from '@slack/bolt'
import { OpenHomeArgs } from './type'

export const openHome = async ({ event, client }: OpenHomeArgs) => {
  await client.views.publish({
    user_id: event.user,
    view: {
      ...homeView,
    },
  })
}

export const homeView: View = {
  type: 'home',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'BuySellGPTへようこそ',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '何でも質問することができます',
      },
    },
  ],
}
