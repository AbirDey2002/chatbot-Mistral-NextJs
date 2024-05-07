"use client"

import { FaSearch } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from 'react';

export default function ChatbotClient({chats, length}) {

  const chatContainerRef = useRef(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Scroll to the bottom when the component mounts or updates
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chats]); // Re-run the effect when chats change

  const handleDelete = async (e) => {
    e.preventDefault();

    if(length === 0){
      return;
    }

    const id = "6634833a146715c965098dfd";

    const res = await fetch(`https://chatbot-mistral-next-js.vercel.app/api/chats?id=${id}`,{
      method: "DELETE"
    });

    if(res.ok){
      router.refresh();
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!text){
      console.log("Empty Input");
      return;
    }

    const id = "6634833a146715c965098dfd";

    const res = await fetch("https://chatbot-mistral-next-js.vercel.app/api/chats",{
      method: "PUT",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ text, id }),
    });

    if(!res.ok){
      setText("");
      console.log("Couldn't uplaod user chat");
    }

    router.refresh();
    setLoading(true);

    const bot = await fetch("https://chatbot-mistral-next-js.vercel.app/api/generate-text",{
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({input:text}),
    });

    const {textData} = await bot.json();
    const bot_text = textData[0].generated_text;
    console.log(bot_text);

    const resBot = await fetch("https://chatbot-mistral-next-js.vercel.app/api/chats",{
      method: "PUT",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ text:bot_text, id }),
    });

    if(!resBot.ok){
      setText("");
      console.log("Couldn't uplaod bot chat");
      setLoading(false);
    }

    if(resBot.ok){
      setText("");
      setLoading(false);
      router.refresh();
    }

    console.log(Object.keys(chats).length);
  }

  return (
    <div className="m-5 relative">      
      {length === 0 ? (
        <div ref={chatContainerRef} className="grid h-[600px] place-items-center">No previous chats</div>
      ):(
        <div ref={chatContainerRef} className="flex flex-col gap-5 mx-[300px] h-[600px] overflow-y-scroll scrollbar-hide">
          {Object.keys(chats).map((key, index) => (
            <div key={key}>
              { key % 2 === 0 ? (
                <div className="flex justify-end"><div className="rounded-lg p-3 bg-zinc-300/40 w-[400px] text-end">{chats[key]}</div></div>
              ):(
                <div><div className="rounded-lg p-3 bg-teal-300/40 w-[400px] ">{chats[key]}</div></div>
              )}
            </div>
          ))}
          {loading === true ? (
            <div><div className="rounded-lg p-4 pt-5 bg-teal-300/40 w-[400px] flex gap-1 justify-center">
              
              <div className='h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
              <div className='h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
              <div className='h-4 w-4 bg-black rounded-full animate-bounce'></div>
  
            </div></div>
          ):(
            <div></div>
          )}
        </div>
      )}
      <form className="fixed inset-x-0 bottom-5 mt-[630px] w-full">
        <div className="flex justify-center"><input value={text} onChange={(e) => setText(e.target.value)} className="bg-zinc-500/15 rounded-lg px-3 py-1 w-[600px]" placeholder="query"></input><button onClick={handleSubmit} className="p-2 bg-blue-700 rounded-lg ml-3 pt-[7px] pb-[9px]"><FaSearch className="text-white"/></button><button onClick={handleDelete} className="p-2 bg-red-700 rounded-lg ml-3 pt-[7px] pb-[9px]"><FaTrash className="text-white"/></button></div>
      </form>
    </div>
  );
}
