import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// ログを作るとか
// もうちょっと作るとか
export const callGPT35 = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    const generatedText = response.data.choices[0].message.content;
    return generatedText.trim();
  } catch (error) {
    console.error("Error calling GPT-3.5:", error);
    return "Sorry, there was an error generating a response.";
  }
};
