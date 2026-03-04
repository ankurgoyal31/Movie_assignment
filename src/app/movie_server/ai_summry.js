"use server"
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import { configDotenv } from "dotenv";

configDotenv()
const groq = new Groq({ apiKey:`${process.env.GROQ_API_KEY}`});
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY});
 export async function description(que){
let baseMessages = [
    {
      role: 'system',
      content: `You are a movie story summarizer.

Your job is to explain the story of a movie in simple English.

Instructions:
- If you do not know the movie or the movie is very new, call the "websearch" tool to find information about the movie.
- Use the search results to understand the movie story.

Rules for the final answer:
- Write 100-200 words.
- Use simple and clear English.
- Explain the story like a short narrative.
- Start with the main characters and setting.
- Then explain the main conflict and events.
- End with the outcome or theme of the movie.
-Write the response in one clear paragraph.
`
    },
        {
      role: 'user', 
      content: que 
    },
  
   ];

    const completion = await groq.chat.completions.create({ 
   model: "llama-3.1-8b-instant",
    messages: baseMessages,              
    tools: [
      {
        type: "function",
        function: {
          name: "websearch",
          description: "search latest info",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string" }
            },
            required: ["query"]
          }
        }
      }
    ],
    tool_choice: "auto"
  });

let tool_calls=completion.choices[0].message.tool_calls;
  if(!tool_calls){
   return completion.choices[0].message.content ;
  }
    if(tool_calls){
   for (const result of tool_calls) {
  const arg = JSON.parse(result.function.arguments);
  if (result.function.name === "websearch") {
 const re = await websearch(arg);
baseMessages.push({
      role: "tool",
      tool_call_id: result.id,
      name: "websearch",
      content: JSON.stringify(re)
       });
    const step2 = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: baseMessages
  });
  return step2.choices[0].message.content;
   }
}
 }
}
async function websearch({query}) {
  console.log(query,"........")
  const response = await tvly.search(query);
  let res = response.results.map((item)=>{return item.content}).join("\n\n")
  return res;
}
