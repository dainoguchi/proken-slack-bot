import { ask } from "./lib/gpt";
import { AppMentionArgs } from "./type";

export const appMention = async ({ client, event, say }: AppMentionArgs) => {
  const prompt = event.text.trim();
  console.log(event)

  // promptを' 'でsplitして
  // 要素数が1つの場合はモーダルを表示
  // 要素数が2つ以上の場合はGPT-3.5に質問
  const promptArray = prompt.split(" ");

  // promptが空の場合はモーダルを表示
  if (promptArray.length === 1) {
    say(
      {
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
      }
    );
  } else {
    const channelId = event.channel;

    const threadId = event.thread_ts || event.ts;
    console.log("event.thread_ts: ", event.thread_ts);
    console.log("event.ts: ", event.ts);

    const replies = await client.conversations.replies({
      channel: channelId,
      ts: threadId,
    });

    console.log("replies.messages: \n", replies.messages[0]);

    if (!replies.messages) {
      await say({
        text: `スレッドの中から呼び出してください`,
        thread_ts: threadId,
      });
      return;
    }

    const response = await ask(prompt);
    console.log(response)

    // スレッドにGPTから返信
    await say({
      text: `Response: ${response}`,
      thread_ts: event.ts,
    });
  }
};
