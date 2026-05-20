# AI Log Analyzer

Simple Node.js POC to analyze logs with AI.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Export your API key in the shell:

```bash
export GEMINI_API_KEY="your_real_api_key"
```

## Project Structure

- `src/analyze.js` - Main analyzer entrypoint
- `src/prompts/basePrompt.js` - Base AI prompt template
- `src/utils/` - Cleaning, retry, and known-issue detection helpers
- `src/data/knownIssues.js` - Organizational known patterns
- `src/logs/` - Sample log files for testing

## Run

```bash
node src/analyze.js src/logs/sample.log
```

Terraform example:

```bash
node src/analyze.js src/logs/terraform.log
```

## Security

- Do not commit real API keys.
- Prefer shell environment variables for secrets.