import { View } from '@slack/bolt'
import { openModalArgs } from '../type'

export const openTemplateModal = async ({ body, client }: openModalArgs) => {
  console.log('openTemplateModal    ')
  console.log(body)
  console.log('modal 終わり')

  const metadata = JSON.stringify({
    channel_id: body.channel.id,
    message_ts: body.message.ts,
  })

  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      ...templateModalView,
      private_metadata: metadata,
    },
  })
}

export const templateModalView: View = {
  type: 'modal',
  callback_id: 'template_modal',
  title: {
    type: 'plain_text',
    text: 'ChatGPTにお願いしたいこと',
  },
  blocks: [
    {
      type: 'actions',
      block_id: 'modal_actions',
      elements: [
        {
          type: 'button',
          action_id: 'open_email_modal_button',
          text: {
            type: 'plain_text',
            text: 'Emailを書いてください',
          },
        },
        {
          type: "button",
          action_id: "open_search_modal_button",
          text: {
            type: "plain_text",
            text: "情報源付きで検索・質問に答えてください",
          },
        },
        {
          type: "button",
          action_id: "open_summarize_modal_button",
          text: {
            type: "plain_text",
            text: "文章を要約してください",
          },
        },
      ],
    },
  ],
}
