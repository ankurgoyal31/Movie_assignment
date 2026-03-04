"use server"
import Groq from "groq-sdk";
import { configDotenv } from "dotenv";
const groq = new Groq({ apiKey:`${process.env.GROQ_API_KEY}`});
configDotenv()
export async function description(que){
let baseMessages = [
    { 
      role: 'system',
      content: `You are a movie summarizer.
Your job is to explain the movie story in simple English.
Rules:
1. Write a detailed explanation of the movie.
2. Use simple English words.
3. Write at least 100-150 words.
4. Explain the story from beginning to end.
5. Response should be descriptive and clear. `
    },
        {
      role: 'user', 
      content: que 
    },
  
   ];
 
   const completion = await groq.chat.completions.create({ 
    model: "llama-3.3-70b-versatile",
    messages: baseMessages,             
   }) 
 return completion.choices[0].message.content;
}
// main("bahubali Full Movie in hinglish")
// console.log(await description("bahibali"))