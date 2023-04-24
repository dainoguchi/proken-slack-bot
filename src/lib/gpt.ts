import { App, GlobalShortcut } from "@slack/bolt";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import { AppMentionArgs } from "../type";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const GPT_4 = "gpt-4";
const GPT_3_5 = "gpt-3.5-turbo";

export const ask = async (prompt: string, model = GPT_3_5) => {
  try {
    const response = await openai.createChatCompletion({
      model: model,
      messages: [{ role: "user", content: prompt }],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling GPT-3.5:", error);
    return "Sorry, there was an error generating a response.";
  }
};

export const askWithHistory = async (
  messages: ChatCompletionRequestMessage[],
  model = GPT_3_5
) => {
  const response = await openai.createChatCompletion({
    model: model,
    messages: messages,
  });

  return response.data.choices[0].message?.content;
};
