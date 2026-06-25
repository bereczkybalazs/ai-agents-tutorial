# ALDI Shopping Assistant (Vercel AI SDK)

Console chatbot built with the Vercel AI SDK and the OpenAI provider while preserving the original ALDI flow.

## Run

1. Copy `.env.example` to `.env`.
2. Set `OPENAI_API_KEY` with your OpenAI API key.
3. Optionally change `ALDI_MODEL` if you want a different OpenAI model.
4. Install dependencies:

```bash
npm install
```

5. Start the CLI:

```bash
npm run dev
```

## What it does

- searches recipes from the ALDI API
- asks for recipe choice, portions, and pantry preference
- fetches recommended basket items
- lets the user choose a store
- generates an in-store route and 9x9 grid summary
