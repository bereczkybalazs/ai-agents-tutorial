# ALDI Shopping Assistant (Mastra)

Console chatbot rebuilt on Mastra while preserving the original ALDI flow.

## Run

1. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
2. Install dependencies:

```bash
npm install
```

3. Start the CLI:

```bash
npm run dev
```

## What it does

- searches recipes from the ALDI API
- asks for recipe choice, portions, and pantry preference
- fetches recommended basket items
- lets the user choose a store
- generates an in-store route and 9x9 grid summary
