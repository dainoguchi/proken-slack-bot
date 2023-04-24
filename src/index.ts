import { app } from "./app";
import { appMention } from "./mention";
import { openEmailModal, submitEmailPrompt } from "./modals/email";
import { openTemplateModal } from "./modals/template";
import { addPingCommand } from "./command";

(async () => {
  // アプリを起動します
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();

addPingCommand(app);

app.event("app_mention", appMention);
app.action("open_template_modal_button", openTemplateModal);
app.action("open_email_modal_button", openEmailModal);
app.view("email_modal", submitEmailPrompt);