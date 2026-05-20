import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cleanLogs } from "./utils/cleanLogs.js";
import { cleanJSON } from "./utils/cleanJSON.js";
import { retry } from "./utils/retry.js";
import { detectKnownIssues } from "./utils/detectKnownIssues.js";
import { buildBasePrompt } from "./prompts/basePrompt.js";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing. Export it in your shell before running the analyzer.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview", // 15 RPM, 500 RPD
});

async function analyzeLogs(logs) {
  const cleanedLogs = cleanLogs(logs);
  const knownIssue = detectKnownIssues(cleanedLogs);

  if (knownIssue.matched) {
    return {
      category: "known_issue",
      error: knownIssue.issue,
      root_cause: "Matched organizational known-issue pattern in logs",
      fix: knownIssue.suggested_fix,
      severity: "high",
      confidence: "high",
    };
  }

  const prompt = buildBasePrompt(cleanedLogs);

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
    console.log("Usage: node src/analyze.js <logfile>");
    process.exit(1);
  }

  const logs = fs.readFileSync(file, "utf-8");

  const result = await analyzeLogs(logs);

  console.log(JSON.stringify(result, null, 2));
}

main();
