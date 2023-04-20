import { SlackActionMiddlewareArgs, View } from "@slack/bolt";
import { app } from "./app";
import { appMention } from "./app-mention";
import { pingCommand } from "./command";

(async () => {
  // アプリを起動します
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();

app.command("/ping", pingCommand);

app.event("app_mention", appMention);

// app.view("email_modal", async ({ ack, view, client }) => {
//   await ack();

//   const formModal: View = {
//     type: "modal",
//     callback_id: "email_form_modal",
//     title: {
//       type: "plain_text",
//       text: "Email作成",
//     },
//     blocks: [
//       {
//         type: "input",
//         block_id: "email_input",
//         element: {
//           type: "plain_text_input",
//           action_id: "email_text",
//           multiline: true,
//           max_length: 3000,
//           placeholder: {
//             type: "plain_text",
//             text: "ここにEmailを書いてください...",
//           },
//         },
//         label: {
//           type: "plain_text",
//           text: "Email",
//         },
//       },
//       {
//         type: "actions",
//         block_id: "submit_button",
//         elements: [
//           {
//             type: "button",
//             action_id: "submit_email",
//             text: {
//               type: "plain_text",
//               text: "送信",
//             },
//             style: "primary",
//           },
//         ],
//       },
//     ],
//   };

//   try {
//     await client.views.open({
//       token: process.env.SLACK_BOT_TOKEN,
//       trigger_id: body.trigger_id,
//       view: formModal,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// });
