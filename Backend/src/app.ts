import express, { Request, Response } from "express";
import cors from "cors";
import { runAgent } from "./agent/agentLoop";

const app = express();
app.use(cors());
app.use(express.json());

// Type for the Query string
interface AgentQuery {
  q?: string;
}

app.get("/stream", async (req: Request<{}, {}, {}, AgentQuery>, res: Response) => {
  // SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const query = req.query.q;
  
  // Helper to format SSE data
  const sendEvent = (type: string, content: string) => {
    res.write(`data: ${JSON.stringify({ type, content })}\n\n`);
  };

  if (!query) {
    sendEvent("error", "No query provided");
    res.end();
    return;
  }

  await runAgent(query, sendEvent);

  res.end();
});

export default app;