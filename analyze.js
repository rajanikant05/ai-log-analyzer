import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cleanLogs } from "./utils/cleanLogs.js";
import { cleanJSON } from "./utils/cleanJSON.js";
import { retry } from "./utils/retry.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview", // 15 RPM, 500 RPD
});

async function analyzeLogs(logs) {
  const cleanedLogs = cleanLogs(logs);
  const prompt = `
You are a senior Site Reliability Engineer (SRE) and DevOps architect.

Your task:
1. Identify the PRIMARY error.
2. Determine the MOST LIKELY root cause.
3. Suggest a PRACTICAL fix.
4. Classify severity.

Rules:
- Ignore duplicate/repeated logs.
- Focus on the first meaningful failure.
- Keep responses concise.
- Return ONLY valid JSON.
- No markdown.
- No explanations outside JSON.

Severity rules:
- low -> warnings/non-blocking
- medium -> partial failures
- high -> deployment crash/service down

Response format:
{
  "error": "...",
  "root_cause": "...",
  "fix": "...",
  "severity": "low | medium | high"
}

Logs:
${cleanedLogs}
`;

  const result = await retry(() => model.generateContent(prompt));
  const response = await result.response;
  const text = response.text();

  const cleaned = cleanJSON(text);
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return {
      error: "Parsing failed",
      raw: cleaned,
    };
  }
}

async function main() {
  const file = process.argv[2];

  if (!file) {
    console.log("Usage: node analyze.js <logfile>");
    process.exit(1);
  }

  const logs = fs.readFileSync(file, "utf-8");

  const result = await analyzeLogs(logs);

  console.log(JSON.stringify(result, null, 2));
}

main();
