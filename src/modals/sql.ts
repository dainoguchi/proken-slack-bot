import { View } from '@slack/bolt'
import { openModalArgs, submitPromptArgs } from '../type'
import { ask } from '../lib/gpt'

export const openSqlModal = async ({ body, client }: openModalArgs) => {
  console.log('openSqlModal    ')
  console.log(body)
  console.log('modal 終わり')

  const metadata = body.view.private_metadata

  await client.views.push({
    trigger_id: body.trigger_id,
    view: {
      ...sqlModalView,
      private_metadata: metadata,
    },
  })
}

export const sqlModalView: View = {
  type: 'modal',
  callback_id: 'sql_modal',
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
        text: '以下にSQLに関しての質問を入力してください',
      },
    },
    {
      type: 'input',
      block_id: 'sql_question_purpose_block',
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

const generateSqlPrompt = (input: string): string => {
  const sqlPromptText = `# 命令 #
あなたはSQLのプロとして、今から以下の条件を守ってクエリを作成してください
# 条件 #
・返答の中にURLは含めないで下さい
・返答にオンライン参考文献を使用した場合、サイト名のみを提示して下さい
# 入力文 #
${input}`
  return sqlPromptText
}

export const submitSqlPrompt = async ({
  body,
  client,
  ack,
}: submitPromptArgs) => {
  await ack({ response_action: 'clear' })

  const inputSqlQuestion =
    body.view.state.values.sql_question_purpose_block.plain_text_input_action
      .value

  const metadata = JSON.parse(body.view.private_metadata)
  const { channel_id, message_ts } = metadata

  // 入力された文章の内容をコンソールに出力
  console.log(`Sql Purpose: ${inputSqlQuestion}`)

  const res = await ask(generateSqlPrompt(inputSqlQuestion))

  // オプション: 入力されたメールの用途と内容をユーザーに確認するメッセージを送信
  await client.chat.postMessage({
    channel: channel_id,
    thread_ts: message_ts,
    text: res,
  })
}
