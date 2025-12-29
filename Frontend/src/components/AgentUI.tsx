import React, { useState } from "react";
import { useAgentStream } from "../hooks/useAgentStream";
import { Bot, User, Terminal, Send, Loader2 } from "lucide-react";

export const AgentUI = () => {
  const [input, setInput] = useState("");
  const { messages, status, isLoading, startStream } = useAgentStream();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    startStream(input);
    setInput("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col h-screen bg-gray-50">
      
      {/* HEADER */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800">Store Agent</h1>
            <p className="text-xs text-gray-500">Powered by Gemini 1.5 Flash</p>
          </div>
        </div>
        
        {/* STATUS INDICATOR (The Glass Box) */}
        <div className={`text-sm font-mono px-3 py-1 rounded-full border ${
          isLoading ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse" : "bg-gray-100 text-gray-500"
        }`}>
          {status}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            
            {/* Icons */}
            {msg.role !== "user" && (
               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                 msg.role === "system" ? "bg-gray-200" : "bg-blue-100"
               }`}>
                 {msg.role === "system" ? <Terminal size={14} /> : <Bot size={16} className="text-blue-600"/>}
               </div>
            )}

            {/* Message Bubble */}
            <div className={`p-3 rounded-lg max-w-[80%] text-sm leading-relaxed ${
              msg.role === "user" 
                ? "bg-blue-600 text-white rounded-br-none" 
                : msg.role === "system"
                ? "bg-gray-100 text-gray-600 font-mono text-xs border border-gray-200 w-full"
                : "bg-white border border-gray-200 shadow-sm rounded-bl-none text-gray-800"
            }`}>
              {msg.content}
            </div>

          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask check stock or place orders..."
          className="w-full p-4 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="absolute right-3 top-3 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> : <Send className="w-5 h-5 text-gray-600" />}
        </button>
      </form>

    </div>
  );
};