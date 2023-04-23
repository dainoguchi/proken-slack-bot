import { app } from "./app";
import { appMention } from "./mention";
import { openEmailModal } from "./modals/email";
import { openTemplateModal } from "./modals/template";
import { pingCommand } from "./command";
import { ask } from "./lib/gpt";

(async () => {
  // アプリを起動します
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();

function usePingCommand(app: any) {
  app.command("/ping", pingCommand);
}

usePingCommand(app);
app.event("app_mention", appMention);
app.action("open_template_modal_button", openTemplateModal);
app.action("open_email_modal_button", openEmailModal);

const generatePrompt = (input: string): string => {
  return `以下の用途に沿ったビジネスメールの叩き台を生成してください。 ${input}。件名もよろしく`;
};

app.view("email_modal", async ({ ack, body, view, logger, client }) => {
  await ack();

  const emailPurposeBlock =
    view.state.values.email_purpose_block.email_purpose_action;

  let emailPurposeValue = "";
  if (emailPurposeBlock) {
    emailPurposeValue = emailPurposeBlock.selected_option.value;
    console.log("Selected option:", emailPurposeValue);
  } else {
    console.error("Error: emailPurposeBlock is undefined.");
  }

  const metadata = JSON.parse(view.private_metadata);
  const { channel_id, message_ts } = metadata;

  // 取得したメールの用途と内容をコンソールに出力
  console.log(`Email Purpose: ${emailPurposeValue}`);

  const res = await ask(generatePrompt(emailPurposeValue));

  // オプション: 入力されたメールの用途と内容をユーザーに確認するメッセージを送信
  try {
    await client.chat.postMessage({
      channel: channel_id,
      thread_ts: message_ts,
      text: res,
    });
  } catch (error) {
    logger.error(`Error sending message: ${error}`);
  }
});
