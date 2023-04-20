import { View } from "@slack/bolt";
import { openModalArgs } from "../type";

export const openEmailModal = async ({ body, client }:openModalArgs) => {
  await client.views.push({
    trigger_id: body.trigger_id,
    view: emailModalView,
  });
}

export const emailModalView: View = {
  type: "modal",
  callback_id: "email_modal",
  title: {
    type: "plain_text",
    text: "ChatGPTにお願いしたいこと",
  },
  submit: {
    type: "plain_text", 
    text: "送信"
  },
  blocks: [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "メール作成"
            }
        },
        {
            dispatch_action: true,
            type: "input",
            element: {
                type: "plain_text_input",
                action_id: "plain_text_input-action"
            },
            label: {
                type: "plain_text",
                text: "相手はどのような人ですか？",
                emoji: true
            }
        },
        {
            type: "input",
            element: {
                type: "plain_text_input",
                multiline: true,
                action_id: "plain_text_input-action"
            },
            label: {
                type: "plain_text",
                text: "どのような内容ですか？",
                emoji: true
            }
        },
    ],
};