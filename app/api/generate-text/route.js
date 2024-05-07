import { NextResponse } from "next/server";

export async function POST(req){
  try {
    const query = await req.json();

    if(!query.input){
      throw new Error("Missing 'input' field in the request body");
    }
    
    if(!process.env.HUGGINGFACE_ACCESS_TOKEN){
      throw new Error("Missing 'access token'");
    }

    const modelUrl = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
    const input = query.input;

    const response = await fetch(modelUrl, {
      headers:{
        Authorization:`Bearer ${process.env.HUGGINGFACE_ACCESS_TOKEN}`,
        "Content-Type":"application/json",
      },
      method: "POST",
      body: JSON.stringify({inputs:input}),
    })

    if(!response.ok){
      throw new Error("request failed");
    }

    const textData = await response.json();
    
    return NextResponse.json({textData},{status:200});  
  } catch (error) {
    const textData = [{generated_text:"Sorry I'm unable to answer that query"}]

    return NextResponse.json({textData},{status:500});  
  }
}