import { model } from "../config/gemini";
import { toolsDeclaration } from "../tools/toolDefinitions";
import { toolsImplementation } from "../tools/inventoryTools";
import { FunctionCallPart, FunctionResponsePart } from "@google/generative-ai";

type EventSender = (type: string, data: string) => void;

export async function runAgent(userQuery: string, sendEvent: EventSender) {
  const chat = model.startChat({
    tools: toolsDeclaration,
  });

  try {
    sendEvent("status", "🧠 Gemini is thinking...");

    // ✅ FIXED SYSTEM PROMPT - Tells Gemini about ALL tools
    const fullQuery = `You are a store agent with these tools: check_inventory, get_price, place_order.
Use get_price for pricing questions, check_inventory for stock questions, place_order for orders.

IMPORTANT: ALWAYS use tools first for data questions, then give FINAL answer using tool results. No refusals.

Query: ${userQuery}`;

    let result = await chat.sendMessage(fullQuery);
    let calls = result.response.functionCalls();

    let loopCount = 0;
    const MAX_LOOPS = 3;

    // Tool loop
    while (calls && calls.length > 0 && loopCount < MAX_LOOPS) {
      loopCount++;
      const functionResponses: FunctionResponsePart[] = [];

      for (const call of calls) {
        const { name, args } = call;
        sendEvent("status", `🛠️ Executing: ${name}...`);

        const toolFunc = toolsImplementation[name];
        if (!toolFunc) {
          functionResponses.push({
            functionResponse: {
              name,
              response: { content: `Tool ${name} not found` }
            }
          });
          continue;
        }

        try {
          const toolOutput = await toolFunc(args);
          sendEvent("tool_log", JSON.stringify(toolOutput));
          
          functionResponses.push({
            functionResponse: {
              name,
              response: { content: JSON.stringify(toolOutput) }
            }
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          functionResponses.push({
            functionResponse: {
              name,
              response: { content: `Error: ${errorMessage}` }
            }
          });
        }
      }

      if (functionResponses.length > 0) {
        result = await chat.sendMessage(functionResponses);
        calls = result.response.functionCalls();
      } else {
        break;
      }
    }

    if (calls && calls.length > 0) {
      sendEvent("error", "Agent hit tool limit - incomplete response");
      return;
    }

    const finalAnswer = result.response.text()?.trim() || "No final answer generated.";
    sendEvent("status", "📝 Streaming...");
    console.log("📝 [FINAL ANSWER]", finalAnswer);
    const words = finalAnswer.split(" ");
    console.log("📝 [FINAL ANSWER]", words);
    for (const word of words) {
      console.log("Streaming word:", word);
      sendEvent("token", word + " ");
      await new Promise(r => setTimeout(r, 30));
    }

    sendEvent("done", finalAnswer);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendEvent("error", `Agent failed: ${errorMessage}`);
  }
}
