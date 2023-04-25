import { View } from '@slack/bolt'
import { openModalArgs, submitPromptArgs } from '../type'
import { ask } from '../lib/gpt'

export const openExcelModal = async ({ body, client }: openModalArgs) => {
  console.log('openExcelModal    ')
  console.log(body)
  console.log('modal 終わり')

  const metadata = body.view.private_metadata

  await client.views.push({
    trigger_id: body.trigger_id,
    view: {
      ...excelModalView,
      private_metadata: metadata,
    },
  })
}

export const excelModalView: View = {
  type: 'modal',
  callback_id: 'excel_modal',
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
        text: '以下にExcelに関しての質問を入力してください',
      },
    },
    {
      dispatch_action: true,
      type: 'input',
      block_id: 'excel_question_purpose_block',
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

const generateExcelPrompt = (input: string): string => {
  const excelPromptText = `# 命令 #
あなたはExcelのプロとして、今から以下の条件を守って回答して下さい。
# 条件 #
・返答はオンライン参考文献を元に行なって下さい
・返答に使用したオンライン参考文献を提示して下さい
# 入力文 #
${input}`
  return excelPromptText
}

export const submitExcelPrompt = async ({
  body,
  client,
  ack,
}: submitPromptArgs) => {
  await ack({ response_action: 'clear' })

  const inputExcelQuestion =
    body.view.state.values.excel_question_purpose_block.plain_text_input_action
      .value

  const metadata = JSON.parse(body.view.private_metadata)
  const { channel_id, message_ts } = metadata

  // 入力された文章の内容をコンソールに出力
  console.log(`Excel Purpose: ${inputExcelQuestion}`)

  const res = await ask(generateExcelPrompt(inputExcelQuestion))

  // オプション: 入力されたメールの用途と内容をユーザーに確認するメッセージを送信
  await client.chat.postMessage({
    channel: channel_id,
    thread_ts: message_ts,
    text: res,
  })
}
