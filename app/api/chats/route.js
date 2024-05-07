import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Chat from "@/models/chats";

export async function POST(){
  try {
    await connectMongoDB();
    const chatSession = await Chat.create({});
    return NextResponse.json({chatSession},{status: 200})
  } catch (error) {
    return NextResponse.json({message: "Unable to create a chatSession"},{status: 500})
    
  }
}

export async function PUT(req){
  try {
    await connectMongoDB();
    const { text, id } = await req.json();
    const chat = await Chat.findOne({_id:id});
    const chatArr = chat.chats;
    chatArr.push(text);
    // console.log("chat: ",chatArr );
    await Chat.findByIdAndUpdate(id, {chats:chatArr});
    return NextResponse.json({message:"Chats Updated"},{status:200});
  } catch (error) {
    return NextResponse.json({message:"Chats Failed Update"},{status:500});
  }
}

export async function GET(req){
  try {
    await connectMongoDB();
    const id = req.nextUrl.searchParams.get("id");
    console.log(id);
    const chat = await Chat.findOne({_id:id});
    const chatArr = chat.chats;
    return NextResponse.json({chatArr},{status:200});
  } catch (error) {
    return NextResponse.json({message:"Chats fetch Failed"},{status:500});
  }
}

export async function DELETE(req){
  try {
    await connectMongoDB();
    const id = req.nextUrl.searchParams.get("id");
    await Chat.findByIdAndUpdate(id,{chats:[]});
    return NextResponse.json({message:"Chats Updated"},{status:200});
  } catch (error) {
    return NextResponse.json({message:"Chats Failed Update"},{status:500});
  }
}