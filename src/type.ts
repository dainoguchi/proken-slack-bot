import { SayFn } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
export type AppMentionArgs = {
  client: WebClient;
  event: any;
  say: SayFn;
}

export type openModalArgs = {
  body: any;
  client: WebClient;
}