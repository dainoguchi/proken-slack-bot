import { app } from "./app";
import { appMention, openEmailModal } from "./app-mention";
import { pingCommand } from "./command";

(async () => {
  // アプリを起動します
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();

app.command("/ping", pingCommand);

app.event("app_mention", appMention);

app.action("open_email_modal_button", openEmailModal);
