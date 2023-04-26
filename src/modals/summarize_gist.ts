import { View } from '@slack/bolt'
import { openModalArgs, submitPromptArgs } from '../type'
import { ask } from '../lib/gpt'

export const openSummarizeGistModal = async ({
  body,
  client,
}: openModalArgs) => {
  const metadata = body.view.private_metadata

  await client.views.push({
    trigger_id: body.trigger_id,
    view: {
      ...summarizeGistModalView,
      private_metadata: metadata,
    },
  })
}

export const summarizeGistModalView: View = {
  type: 'modal',
  callback_id: 'summarize_gist_modal',
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
        text: '以下に入力された文章を要約します',
      },
    },
    {
      type: 'input',
      block_id: 'summarize_gist_text_block',
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

const generateSummarizeGistPrompt = (inputText: string): string => {
  const summarizeGistPromptText = `# 命令 #
あなたはプロの編集者として、以下の条件を守って入力文の要点を箇条書きにして下さい。
# 条件 #
重要なキーワードを取りこぼさない
文章の意味を変更しない
架空の表現や言葉を使用しない
文章中の数値には変更を加えない
# 入力文 #
${inputText}`
  return summarizeGistPromptText
}

export const submitSummarizeGistPrompt = async ({
  body,
  client,
  ack,
}: submitPromptArgs) => {
  await ack({ response_action: 'clear' })

  const inputText =
    body.view.state.values.summarize_gist_text_block.plain_text_input_action
      .value

  const metadata = JSON.parse(body.view.private_metadata)
  const { channel_id, message_ts } = metadata

  const res = await ask(generateSummarizeGistPrompt(inputText))

  // オプション: 入力されたメールの用途と内容をユーザーに確認するメッセージを送信
  await client.chat.postMessage({
    channel: channel_id,
    thread_ts: message_ts,
    text: res,
  })
}
