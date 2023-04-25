import { App } from "@slack/bolt";
import { config } from "dotenv";
import express from "express";

config();

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
});

const server = express();
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`⚡️ Bolt app is running on port ${port}!`);
});