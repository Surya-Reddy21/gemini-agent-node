// src/types/index.ts

// Defines the structure of the Server-Sent Events coming from the backend
export interface AgentEvent {
  type: "status" | "tool_log" | "token" | "done" | "error" | "answer";
  content: string;
}

// Defines the structure of messages in our chat history
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}