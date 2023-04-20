import { SayFn } from "@slack/bolt";
import { WebClient } from "@slack/web-api";

export interface AppMentionArgs {
  client: WebClient;
  event: any;
  say: SayFn;
}


export interface openModalArgs {
  body: any;
  client: WebClient;
}