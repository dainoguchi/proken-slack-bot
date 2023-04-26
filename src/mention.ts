import { ChatCompletionRequestMessageRoleEnum } from 'openai'
import { askWithHistory } from './lib/gpt'
import { AppMentionArgs } from './type'

export const appMention = async ({ client, event, say }: AppMentionArgs) => {
  try {
    const botUserId = process.env.SLACK_BOT_USER_ID.trim()
    console.log('👺botUserId', botUserId)

    if (event.text === `<@${botUserId}>`) {
      say({
        blocks: [
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '使い方を見る',
                  emoji: true,
                },
                value: 'clicked',
                action_id: 'open_usage_modal_button',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'テンプレート一覧を見る',
                  emoji: true,
                },
                value: 'clicked',
                action_id: 'open_template_modal_button',
              },
            ],
          },
        ],
      })
    } else {
      const channelId = event.channel
      const threadId = event.thread_ts || event.ts

      console.log('event', event)

      const replies = await client.conversations.replies({
        channel: channelId,
        ts: threadId,
      })

      console.log('raw replies: ', replies)

      if (!replies.messages) {
        await say('スレッドが見つかりませんでした')

        return
      }

      // ローディング用の文面を返信
      const waitingMessage = 'GPTに聞いています。しばらくお待ち下さい'
      await client.chat.postMessage({
        channel: channelId,
        text: waitingMessage,
        thread_ts: threadId,
      })

      const preContext = [
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content:
            'これから質問をします。わからないときはわからないと答えてください',
        },
      ]

      let threadMessages = replies.messages.map((message) => {
        if (message.text.includes(waitingMessage)) {
          return null
        }

        // スレッドの中の質問投稿時に
        // BotかUserのロールを付与する
        // botに対するメンションを消す
        return {
          role:
            message.user === botUserId
              ? ChatCompletionRequestMessageRoleEnum.Assistant
              : ChatCompletionRequestMessageRoleEnum.User,
          content: (message.text || '').replace(`<@${botUserId}> `, ''),
        }
      })

      threadMessages = threadMessages.filter((message) => {
        if (message === null) {
          return false
        }

        // botに対するメンション以外は無視する
        if (message.content.startsWith(`<@${botUserId}> `)) {
          return false
        }

        return true
      })

      console.log('threadMessages: ', threadMessages)

      const gptAnswerText = await askWithHistory({
        messages: [...preContext, ...threadMessages],
        slack_id: 'string',
        timestamp: 'string',
        thread_id: 'string',
        channel_id: 'string',
        service: 'string',
      })

      /* スレッドに返信 */
      await client.chat.postMessage({
        channel: channelId,
        text: gptAnswerText,
        thread_ts: threadId,
      })
    }
  } catch (error) {
    if (error.data && error.data.error === 'channel_not_found') {
      console.error(error.data)
    }
    console.error(error)
  }
}
