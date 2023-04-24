import { SlashCommand, AckFn, RespondFn, App } from "@slack/bolt";

export const addPingCommand = (app: App) => {
  app.command("/ping", pingCommand);
};

const pingCommand = async ({
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
