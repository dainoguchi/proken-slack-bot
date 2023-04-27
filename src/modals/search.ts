import { View } from '@slack/bolt'
import { openModalArgs, submitPromptArgs } from '../type'
import { askWithHistory } from '../lib/gpt'

export const openSearchModal = async ({ body, client }: openModalArgs) => {
  const metadata = body.view.private_metadata

  await client.views.push({
    trigger_id: body.trigger_id,
    view: {
      ...searchModalView,
      private_metadata: metadata,
    },
  })
}

export const searchModalView: View = {
  type: 'modal',
  callback_id: 'search_modal',
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
        text: '以下に聞きたい分野とそれに対する質問を入力してください',
      },
    },
    {
      type: 'input',
      block_id: 'search_field_purpose_block',
      element: {
        type: 'plain_text_input',
        action_id: 'plain_text_input_action',
      },
      label: {
        type: 'plain_text',
        text: '分野',
        emoji: true,
      },
    },
    {
      type: 'input',
      block_id: 'search_question_purpose_block',
      element: {
        type: 'plain_text_input',
        action_id: 'plain_text_input_action',
      },
      label: {
        type: 'plain_text',
        text: '質問',
        emoji: true,
      },
    },
  ],
}

const generateSearchPrompt = (
  inputField: string,
  inputQuestion: string
): string => {
  const searchPromptText = `# 命令 #
あなたは${inputField}の専門家として、今から以下の条件を守って回答して下さい。
# 条件 #
・返答の中にURLは含めないで下さい
・返答にオンライン参考文献を使用した場合、サイト名のみを提示して下さい
# 入力文 #
${inputQuestion}`
  return searchPromptText
}

export const submitSearchPrompt = async ({
  body,
  client,
  ack,
}: submitPromptArgs) => {
  await ack({ response_action: 'clear' })

  const inputField =
    body.view.state.values.search_field_purpose_block.plain_text_input_action
      .value
  const inputQuestion =
    body.view.state.values.search_question_purpose_block.plain_text_input_action
      .value

  const metadata = JSON.parse(body.view.private_metadata)
  const { channel_id, message_ts } = metadata

  // 入力した質問内容を送信
  await client.chat.postMessage({
    channel: channel_id,
    thread_ts: message_ts,
    text: `\`\`\`${generateSearchPrompt(inputField, inputQuestion)}\`\`\``,
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
      {
        role: 'user',
        content: generateSearchPrompt(inputField, inputQuestion),
      },
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
