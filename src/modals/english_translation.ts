import { View } from '@slack/bolt'
import { openModalArgs, submitPromptArgs } from '../type'
import { askWithHistory } from '../lib/gpt'

export const openEnglishTranslationModal = async ({
  body,
  client,
}: openModalArgs) => {
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
以下の条件を守って入力文を英訳して下さい。
# 条件 #
・重要なキーワードを取りこぼさない
・文章の意味を変更しない
・架空の表現や言葉を使用しない
・文章中の数値には変更を加えない
・英語の文法に従って英訳する
# 入力文 #
${inputText}
# 翻訳文 #`
  return englishTranslationPromptText
}

export const submitEnglishTranslationPrompt = async ({
  body,
  client,
  ack,
}: submitPromptArgs) => {
  await ack({ response_action: 'clear' })

  const inputText =
    body.view.state.values.english_translation_purpose_block
      .plain_text_input_action.value

  const metadata = JSON.parse(body.view.private_metadata)
  const { channel_id, message_ts } = metadata

  // 入力した質問内容を送信
  await client.chat.postMessage({
    channel: channel_id,
    thread_ts: message_ts,
    text: `\`\`\`${generateEnglishTranslationPrompt(inputText)}\`\`\``,
    username: '質問',
    icon_emoji: ':slack_call:',
  })

  // ローディング用の文面を返信
  const waitingMessage = 'Buddyに聞いています。しばらくお待ち下さい'
  const loadingMessage = await client.chat.postMessage({
    channel: channel_id,
    text: waitingMessage,
    thread_ts: message_ts,
    username: 'Loading...',
    icon_emoji: ':loading:',
  })

  const res = await askWithHistory({
    messages: [
      { role: 'user', content: generateEnglishTranslationPrompt(inputText) },
    ],
    slack_id: 'string',
    timestamp: 'string',
    thread_id: 'string',
    channel_id: 'string',
    service: 'string',
  })

  // 回答を返信
  await client.chat.postMessage({
    channel: channel_id,
    thread_ts: message_ts,
    text: res,
  })

  /* ローディングを削除 */
  client.chat.delete({
    channel: channel_id,
    ts: loadingMessage.ts,
  })

  // プロンプト画面を削除
  client.chat.delete({
    channel: channel_id,
    ts: message_ts,
  })
}
