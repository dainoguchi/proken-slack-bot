import { SlashCommand, AckFn, RespondFn } from "@slack/bolt";

export const pingCommand = async ({
  command,
  ack,
  respond,
}: {
  command: SlashCommand;
  ack: AckFn<string>;
  respond: RespondFn;
}) => {
  // コマンドの受信を確認
  await ack();

  // ユーザーに対してpongを返す
  await respond("pong");
};
