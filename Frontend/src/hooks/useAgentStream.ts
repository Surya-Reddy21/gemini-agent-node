import { useState } from "react";
import type { ChatMessage, AgentEvent } from "../types";

export function useAgentStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<string>("Idle");
  const [isLoading, setIsLoading] = useState(false);

  const startStream = (query: string) => {
    setIsLoading(true);
    setStatus("Connecting...");
    
    // Add User Message immediately
    setMessages((prev) => [...prev, { role: "user", content: query }]);

    // Prepare a placeholder for the Assistant's response
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    // Open Connection
    const eventSource = new EventSource(`http://localhost:3003/stream?q=${encodeURIComponent(query)}`);

    eventSource.onmessage = (event) => {
      try {
        const parsed: AgentEvent = JSON.parse(event.data);

        switch (parsed.type) {
          case "status":
            setStatus(parsed.content);
            break;
          
          // ✅ FIXED: Make tool_log invisible to user
          case "tool_log":
            // Log to console only - don't show in chat
            console.log("🛠️ Tool:", parsed.content);
            break;

          // ...existing code...
          case "token":
            // Append text to the very last message (assistant's)
            setMessages((prev) => {
              const newHistory: ChatMessage[] = [...prev];
              const lastIndex = newHistory.length - 1;
              if (lastIndex < 0) return newHistory;
              const lastMsg = newHistory[lastIndex];
              if (lastMsg.role === "assistant") {
                // replace with a new object to preserve literal role types
                newHistory[lastIndex] = { ...lastMsg, content: lastMsg.content + parsed.content };
              }
              return newHistory;
            });
            break;
          // ...existing code...

          // // ✅ NEW: Handle full answer event (from server fix)
          // case "answer":
          //   // Replace assistant message with complete answer
          //   setMessages((prev) => {
          //     const newHistory = [...prev.slice(0, -1), { 
          //       role: "assistant", 
          //       content: parsed.content 
          //     }];
          //     return newHistory;
          //   });
          //   break;
          
          case "done":
            setStatus("Finished");
            setIsLoading(false);
            eventSource.close();
            break;
            
          case "error":
            setStatus("Error: " + parsed.content);
            setIsLoading(false);
            eventSource.close();
            break;
        }
      } catch (e) {
        console.error("Error parsing SSE:", e);
      }
    };

    eventSource.onerror = () => {
      setStatus("Connection Error");
      setIsLoading(false);
      eventSource.close();
    };
  };

  return { messages, status, isLoading, startStream };
}
