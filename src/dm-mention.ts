import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { askWithHistory } from "./lib/gpt";
import { AppMentionArgs } from "./type";

export const dmAppMention = async ({ client, event, say }: AppMentionArgs) => {

  const prompt = event.text.trim();

  // promptを' 'でsplitして
  // 要素数が1つの場合はモーダルを表示
  // 要素数が2つ以上の場合はGPT-3.5に質問
  const promptArray = prompt.split(" ");

  if (promptArray.length === 1) {
    say({
      blocks: [
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "使い方を見る",
                emoji: true,
              },
              value: "clicked",
              action_id: "open_usage_modal_button",
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "テンプレート一覧を見る",
                emoji: true,
              },
              value: "clicked",
              action_id: "open_template_modal_button",
            },
          ],
        },
      ],
    });
  }else{

  const res = await client.conversations.open({users:event.user})
  const channelId = res.channel.id

  const response = await client.conversations.history(
    {channel: channelId}
    )
  console.log("👺response",response)
  const threadId = response["messages"][0]["ts"]

  console.log("event", event);
  const botUserId = process.env.SLACK_BOT_USER_ID;

  try {
    const replies = await client.conversations.replies({
      channel: channelId,
      ts: threadId,
    });

    console.log("raw replies: ", replies);

    if (!replies.messages) {
      await say("スレッドが見つかりませんでした");

      return;
    }

    // ローディング用の文面を返信
    const waitingMessage = "GPTに聞いています。しばらくお待ち下さい";
    await client.chat.postMessage({
      channel: channelId,
      text: waitingMessage,
      thread_ts: threadId,
    });

    const preContext = [
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content:
          "これから質問をします。わからないときはわからないと答えてください",
      },
    ];

    let threadMessages = replies.messages.map((message) => {
      if (message.text.includes(waitingMessage)) {
        return null;
      }

      // スレッドの中の質問投稿時に
      // BotかUserのロールを付与する
      // botに対するメンションを消す
      return {
        role:
          message.user === botUserId
            ? ChatCompletionRequestMessageRoleEnum.Assistant
            : ChatCompletionRequestMessageRoleEnum.User,
        content: (message.text || "").replace(`<@${botUserId}> `, ""),
      };
    });

    threadMessages = threadMessages.filter((message) => {
      if (message === null) {
        return false;
      }

      // botに対するメンション以外は無視する
      if (message.content.startsWith(`<@${botUserId}> `)) {
        return false;
      }

      return true;
    });

    console.log("threadMessages: ", threadMessages);

    const gptAnswerText = await askWithHistory(
      [...preContext, ...threadMessages] // 配列を結合
    );

    /* スレッドに返信 */
    await client.chat.postMessage({
      channel: channelId,
      text: gptAnswerText,
      thread_ts: threadId,
    });
  } catch (error) {
    console.error(error);
  }
}};
