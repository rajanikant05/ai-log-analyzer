import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview", // 15 RPM, 500 RPD
});

async function analyzeLogs(logs, retries = 5, delay = 3000) {
  const prompt = `
You are a senior DevOps engineer.

Analyze the logs and respond STRICTLY in JSON format:

{
  "error": "...",
  "root_cause": "...",
  "fix": "...",
  "severity": "low | medium | high"
}

Logs:
${logs}
`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
        return JSON.parse(cleaned);
      } catch (e) {
        return { error: "Parsing failed", raw: text };
      }
    } catch (err) {
      if (err.status === 503 && attempt < retries) {
        console.error(`Attempt ${attempt} failed (503). Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
      } else {
        throw err;
      }
    }
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
