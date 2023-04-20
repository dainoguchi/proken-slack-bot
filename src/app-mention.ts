import { ask } from "./lib/gpt";
import { emailModalView } from "./features/mail";
import { SayFn } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
interface AppMentionArgs {
  client: WebClient;
  event: any;
  say: SayFn;
}

export const appMention = async ({ client, event, say }: AppMentionArgs) => {
  const prompt = event.text.trim();
  console.log(event)

  // promptを' 'でsplitして
  // 要素数が1つの場合はモーダルを表示
  // 要素数が2つ以上の場合はGPT-3.5に質問
  const promptArray = prompt.split(" ");

  // promptが空の場合はモーダルを表示
  if (promptArray.length === 1) {
    say({
      blocks: [    
        {
          type: "section",
          block_id: "button_block",
          text: {
            type: "mrkdwn",
            text: "Events API から直接モーダルを開くことはできません。ボタンをクリックしてもらう必要があります。",
          },
          accessory: {
              type: "button",
              text: {"type": "plain_text", "text": "Mailモーダルを開く"},
              value: "clicked",
              action_id: "open_email_modal_button",
          },
        },
      ]
    });
  } else {
    const channelId = event.channel;

    const threadId = event.thread_ts || event.ts;
    console.log("event.thread_ts: ", event.thread_ts);
    console.log("event.ts: ", event.ts);

    const replies = await client.conversations.replies({
      channel: channelId,
      ts: threadId,
    });

    console.log("replies.messages: \n", replies.messages);

    if (!replies.messages) {
      await say({
        text: `スレッドの中から呼び出してください`,
        thread_ts: threadId,
      });
      return;
    }

    const response = await ask(prompt);

    // スレッドにGPTから返信
    await say({
      text: `Response: ${response}`,
      thread_ts: event.ts,
    });
  }
};

interface openModalArgs {
  body: any;
  client: WebClient;
}

export const openEmailModal = async ({ body, client }:openModalArgs) => {
  await client.views.open({
    trigger_id: body.trigger_id,
    view: emailModalView,
  });
}
