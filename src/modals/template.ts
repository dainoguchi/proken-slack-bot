import { View } from "@slack/bolt";
import { openModalArgs } from "./type";

export const openTemplateModal = async ({ body, client }:openModalArgs) => {
  await client.views.open({
    trigger_id: body.trigger_id,
    view: templateModalView,
  });
}

export const templateModalView: View = {
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
          action_id: "open_email_modal_button",
          text: {
            type: "plain_text",
            text: "Emailを書いてください",
          },
        },
      ],
    },
  ],
};