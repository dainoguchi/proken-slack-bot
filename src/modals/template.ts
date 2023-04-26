import { View } from '@slack/bolt'
import { openModalArgs } from '../type'

export const openTemplateModal = async ({
  body,
  client,
  ack,
}: openModalArgs) => {
  await ack()
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
          action_id: 'open_search_modal_button',
          text: {
            type: 'plain_text',
            text: '指定した分野の質問に答えて',
          },
        },
        {
          type: 'button',
          action_id: 'open_spreadsheet_modal_button',
          text: {
            type: 'plain_text',
            text: 'スプレッドシートに関して質問に答えて',
          },
        },
        {
          type: 'button',
          action_id: 'open_summarize_modal_button',
          text: {
            type: 'plain_text',
            text: '文章を要約して',
          },
        },
        {
          type: 'button',
          action_id: 'open_summarize_gist_modal_button',
          text: {
            type: 'plain_text',
            text: '文章の要点を箇条書きでまとめて',
          },
        },
        {
          type: 'button',
          action_id: 'open_sql_modal_button',
          text: {
            type: 'plain_text',
            text: 'SQLに関して質問に答えて',
          },
        },
        {
          type: 'button',
          action_id: 'open_gas_modal_button',
          text: {
            type: 'plain_text',
            text: 'GASに関して質問に答えて',
          },
        },
        {
          type: 'button',
          action_id: 'open_translation_modal_button',
          text: {
            type: 'plain_text',
            text: '文章を日本語に翻訳して',
          },
        },
        {
          type: 'button',
          action_id: 'open_english_translation_modal_button',
          text: {
            type: 'plain_text',
            text: '文章を英訳して',
          },
        },
      ],
    },
  ],
}
