import { View } from '@slack/bolt'
import { openModalArgs, submitPromptArgs } from '../type'
import { ask } from '../lib/gpt'

export const openEnglishTranslationModal = async ({
  body,
  client,
}: openModalArgs) => {
  console.log('openEnglishTranslationModal    ')
  console.log(body)
  console.log('modal 終わり')

  const metadata = body.view.private_metadata

  await client.views.push({
    trigger_id: body.trigger_id,
    view: {
      ...englishTranslationModalView,
      private_metadata: metadata,
    },
  })
}

export const englishTranslationModalView: View = {
  type: 'modal',
  callback_id: 'english_translation_modal',
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
        text: '以下に入力された文章を英訳します',
      },
    },
    {
      type: 'input',
      block_id: 'english_translation_purpose_block',
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

const generateEnglishTranslationPrompt = (inputText: string): string => {
  const englishTranslationPromptText = `# 命令 #
入力文を英訳してください
# 入力文 #
${inputText}`
  return englishTranslationPromptText
}

export const submitEnglishTranslationPrompt = async ({
  body,
  client,
  ack,
}: submitPromptArgs) => {
  await ack({ response_action: 'clear' })

  const inputText =
    body.view.state.values.englishTranslation_purpose_block
      .plain_text_input_action.value

  const metadata = JSON.parse(body.view.private_metadata)
  const { channel_id, message_ts } = metadata

  // 入力された文章の内容をコンソールに出力
  console.log(`EnglishTranslation Purpose: ${inputText}`)

  const res = await ask(generateEnglishTranslationPrompt(inputText))

  // オプション: 入力されたメールの用途と内容をユーザーに確認するメッセージを送信
  await client.chat.postMessage({
    channel: channel_id,
    thread_ts: message_ts,
    text: res,
  })
}
