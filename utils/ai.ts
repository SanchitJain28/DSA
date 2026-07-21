import { createDeepSeek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function askAIHelper(systemContext: string, userPrompt: string): Promise<string> {
  if (!process.env.DEEPSEEK_API_KEY) {
    return "Error: DEEPSEEK_API_KEY is not set in your .env file!";
  }

  try {
    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      system: `You are an expert Data Structures and Algorithms assistant. You are integrated directly into a visualizer. 
The user is currently stepping through an algorithm, and they might have questions. 
Be concise, helpful, and reference the specific context provided.
Here is the current state of the algorithm (variables, array state, pointer locations):\n${systemContext}`,
      prompt: userPrompt,
    });
    return text;
  } catch (error: any) {
    return `AI Error: ${error.message || 'Unknown error occurred'}`;
  }
}
