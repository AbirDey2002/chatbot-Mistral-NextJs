import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import ChatbotClient from "@/components/chatbotClient";

const getAllChats = async (id) => {
  const res = await fetch(`http://localhost:3000/api/chats?id=${id}`,{
    method: "GET", cache:"no-store"
  })

  const {chatArr} = await res.json();
  const chatDict = {};
  for (let i = 0;i<chatArr.length;i++){
    chatDict[i] = chatArr[i];
  }
  return chatDict;
}

export default async function Chatbot() {

  const id = "6634833a146715c965098dfd";

  const chats = await getAllChats(id);
  const length = Object.keys(chats).length;
  console.log(Object.keys(chats).length);

  return (
    <div>
      <ChatbotClient chats={chats} length={length}/>
    </div>
    
  );
}
