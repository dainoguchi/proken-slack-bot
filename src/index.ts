import { app } from "./app";
import { appMention } from "./mention";
import { openEmailModal } from "./modals/email";
import { openTemplateModal } from "./modals/template";
import { pingCommand } from "./command";

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

app.view("email_modal", async ({ ack, body, view, logger, client }) => {
  await ack();

  // 入力されたメールの用途と内容を取得
  const emailPurposeBlock = view.state.values.email_purpose_block;
  const emailPurposeValue = emailPurposeBlock.email_purpose_block.value;
  const emailBodyBlock = view.state.values.email_body_block;
  const emailBodyValue = emailBodyBlock.email_body_block.value;

  // 取得したメールの用途と内容をコンソールに出力
  console.log(`Email Purpose: ${emailPurposeValue}`);
  console.log(`Email Content: ${emailBodyValue}`);

  // オプション: 入力されたメールの用途と内容をユーザーに確認するメッセージを送信
  try {
    await client.chat.postMessage({
      channel: body.user.id,
      text: `You entered the following email purpose: ${emailPurposeValue}\n\nEmail content: ${emailBodyValue}`,
    });
  } catch (error) {
    logger.error(`Error sending message: ${error}`);
  }
});
