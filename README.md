# AI Log Analyzer

Simple Node.js POC to analyze logs with AI.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local env file from template:

```bash
cp .env.example .env
```

3. Update `.env` with your real key:

```env
GEMINI_API_KEY=your_real_api_key
```

## Run

```bash
node analyze.js
```

## Security

- `.env` is ignored by git and should never be committed.
- `.env.example` is safe to commit and documents required variables.