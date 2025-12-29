import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const model: GenerativeModel = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash" 
});