import axios from 'axios'
import { ApiRequest, ApiResponse } from '../type'

export const askWithHistory = async (requestBody: ApiRequest) => {
  try {
    const response = await axios.post<ApiResponse>(
      process.env.BE_URL,
      requestBody
    )
    console.log(
      `質問:${JSON.stringify(requestBody)}, 回答:${response.data.message}`
    )
    return response.data.message
  } catch (error) {
    console.error('Error calling GPT:', error)
    return 'Sorry, there was an error generating a response from GPT.'
  }
}
