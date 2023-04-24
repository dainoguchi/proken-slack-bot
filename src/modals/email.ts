import { View } from "@slack/bolt";
import { openModalArgs, submitPromptArgs } from "../type";
import { ask } from "../lib/gpt";

export const openEmailModal = async ({ body, client }: openModalArgs) => {
  console.log("openEmailModal    ");
  console.log(body);
  console.log("modal 終わり");

  const metadata = body.view.private_metadata;

  await client.views.push({
    trigger_id: body.trigger_id,
    view: {
      ...emailModalView,
      private_metadata: metadata,
    },
  });
};

export const emailModalView: View = {
  type: "modal",
  callback_id: "email_modal",
  title: {
    type: "plain_text",
    text: "ChatGPTにお願いしたいこと",
  },
  submit: {
    "type": "plain_text", 
    "text": "送信"
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "メールのたたき台作成",
      },
    },
    // {
    //   // dispatch_action: true,
    //   type: "input",
    //   block_id: "email_purpose_block",
    //   element: {
    //     type: "plain_text_input",
    //     action_id: "email_purpose_block",
    //   },
    //   label: {
    //     type: "plain_text",
    //     text: "どのような用途ですか？",
    //     emoji: true,
    //   },
    // },
    {
      type: "section",
      block_id: "email_purpose_block",
      text: {
        type: "mrkdwn",
        text: "Pick an item from the dropdown list",
      },
      accessory: {
        action_id: "email_purpose_action",
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        options: [
          {
            text: {
              type: "plain_text",
              text: "謝罪メールの叩き台を作る",
              emoji: true,
            },
            value: "謝罪",
          },
          {
            text: {
              type: "plain_text",
              text: "感謝メールの叩き台を作る",
              emoji: true,
            },
            value: "感謝",
          },
        ],
      },
    },

    // {
    //   type: "input",
    //   block_id: "email_body_block",
    //   element: {
    //     type: "plain_text_input",
    //     multiline: true,
    //     action_id: "email_body_block",
    //   },
    //   label: {
    //     type: "plain_text",
    //     text: "どのような内容ですか？",
    //     emoji: true,
    //   },
    // },
  ],
};

const generateEmailPrompt = (input: string): string => {
  return `以下の用途に沿ったビジネスメールの叩き台を生成してください。 ${input}。件名もよろしく`;
};

export const submitEmailPrompt = async ({ body, client, ack }: submitPromptArgs) => {
  await ack();
  const emailPurposeBlock =
  body.view.state.values.email_purpose_block.email_purpose_action;

  let emailPurposeValue = "";
  if (emailPurposeBlock) {
    emailPurposeValue = emailPurposeBlock.selected_option.value;
    console.log("Selected option:", emailPurposeValue);
  } else {
    console.error("Error: emailPurposeBlock is undefined.");
  }


  const metadata = JSON.parse(body.view.private_metadata);
  const { channel_id, message_ts } = metadata;

  // 取得したメールの用途と内容をコンソールに出力
  console.log(`Email Purpose: ${emailPurposeValue}`);

  const res = await ask(generateEmailPrompt(emailPurposeValue));

  // オプション: 入力されたメールの用途と内容をユーザーに確認するメッセージを送信
  await client.chat.postMessage({
    channel: channel_id,
    thread_ts: message_ts,
    text: res,
  });
};
