import { View } from '@slack/bolt'
import { openModalArgs, submitPromptArgs } from '../type'
import { ask } from '../lib/gpt'

export const openSearchModal = async ({ body, client }: openModalArgs) => {
  console.log('openSearchModal    ')
  console.log(body)
  console.log('modal 終わり')

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
      dispatch_action: true,
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
あなたは${inputField}のプロとして、今から以下の条件を守って回答して下さい。
# 条件 #
・返答の中にURLは含めないで下さい
・返答はオンライン参考文献を元に行なって下さい
・返答に使用した全てのオンライン参考文献において、サイト名のみを提示して下さい
# 入力文 #
マーケティングにおいて重要なことは何ですか？

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

  // 入力された文章の内容をコンソールに出力
  console.log(`Search Purpose: ${inputField}`)
  console.log(`Search Purpose: ${inputQuestion}`)

  const res = await ask(generateSearchPrompt(inputField, inputQuestion))

  // オプション: 入力されたメールの用途と内容をユーザーに確認するメッセージを送信
  await client.chat.postMessage({
    channel: channel_id,
    thread_ts: message_ts,
    text: res,
  })
}
