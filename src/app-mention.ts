import { ask } from "./lib/gpt";
import { AppMentionEvent, SayFn, View } from "@slack/bolt";
import { WebClient } from "@slack/web-api";

const modalView: View = {
  type: "modal",
  callback_id: "email_modal",
  title: {
    type: "plain_text",
    text: "ChatGPTにお願いしたいこと",
  },
  blocks: [
    {
      type: "actions",
      block_id: "modal_actions",
      elements: [
        {
          type: "button",
          action_id: "modal_button",
          text: {
            type: "plain_text",
            text: "Emailを書いてください",
          },
        },
      ],
    },
  ],
};

interface AppMentionArgs {
  client: WebClient;
  event: any;
  say: SayFn;
}

export const appMention = async ({ client, event, say }: AppMentionArgs) => {
  const prompt = event.text.trim();

  console.log(prompt);

  // promptが空の場合はモーダルを表示
  if (prompt === "") {
    await client.views.open({
      trigger_id: event.trigger_id,
      // モーダル + callbackの定義
      view: modalView,
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

    // Send the response back to the channel in the same thread
    await say({
      text: `GPT-3.5 response: ${response}`,
      thread_ts: event.ts, // Reply in the same thread where the bot was mentioned
    });
  }
};
