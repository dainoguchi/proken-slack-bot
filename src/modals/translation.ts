import { View } from '@slack/bolt'
import { openModalArgs, submitPromptArgs } from '../type'
import { ask } from '../lib/gpt'

export const openTranslationModal = async ({ body, client }: openModalArgs) => {
  console.log('openTranslationModal    ')
  console.log(body)
  console.log('modal 終わり')

  const metadata = body.view.private_metadata

  await client.views.push({
    trigger_id: body.trigger_id,
    view: {
      ...translationModalView,
      private_metadata: metadata,
    },
  })
}

export const translationModalView: View = {
  type: 'modal',
  callback_id: 'translation_modal',
  title: {
    type: 'plain_text',
    text: 'ChatGPTにお願いしたいこと',
  },
  submit: {
    type: 'plain_text',
    text: '送信',
  },
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '以下に入力された文章を翻訳します',
      },
    },
    {
      type: 'input',
      block_id: 'translation_purpose_block',
      element: {
        type: 'plain_text_input',
        multiline: true,
        action_id: 'plain_text_input_action',
      },
      label: {
        type: 'plain_text',
        text: '文章',
        emoji: true,
      },
    },
  ],
}

const generateTranslationPrompt = (inputText: string): string => {
  const translationPromptText = `# 命令 #
入力文を翻訳してください
# 入力文 #
${inputText}`
  return translationPromptText
}

export const submitTranslationPrompt = async ({
  body,
  client,
  ack,
}: submitPromptArgs) => {
  await ack({ response_action: 'clear' })

  const inputText =
    body.view.state.values.translation_purpose_block.plain_text_input_action
      .value

  const metadata = JSON.parse(body.view.private_metadata)
  const { channel_id, message_ts } = metadata

  // 入力された文章の内容をコンソールに出力
  console.log(`Translation Purpose: ${inputText}`)

  const res = await ask(generateTranslationPrompt(inputText))

  // オプション: 入力されたメールの用途と内容をユーザーに確認するメッセージを送信
  await client.chat.postMessage({
    channel: channel_id,
    thread_ts: message_ts,
    text: res,
  })
}
