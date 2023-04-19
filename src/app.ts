import { App, GlobalShortcut, AppMentionEvent } from "@slack/bolt";
import { config } from "dotenv";
import { callGPT35 } from "./lib/gpt";

config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// book review

app.command("/ping", async ({ command, ack, respond }) => {
  // コマンドの受信を確認
  await ack();

  // ユーザーに対してpongを返す
  await respond("pong");
});

// 気軽にテストできないことがストレスだな
app.event("app_mention", async ({ event, say }) => {
  const channelId = event.channel;
  const threadId = event.thread_ts || event.ts;

  const replies = await app.client.conversations.replies({
    channel: channelId,
    ts: threadId,
  });

  if (!replies.messages) {
    await say({
      text: `スレッドの中から呼び出してください`,
      thread_ts: threadId,
    });
    return;
  }

  // Call GPT-3.5 to generate a response
  const prompt = event.text;
  const response = await callGPT35(prompt);

  // Send the response back to the channel in the same thread
  await say({
    text: `GPT-3.5 response: ${response}`,
    thread_ts: event.ts, // Reply in the same thread where the bot was mentioned
  });
});

(async () => {
  // Start your app
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();
