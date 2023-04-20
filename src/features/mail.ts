import { View } from "@slack/bolt";

export const emailModalView: View = {
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