# LevelEdge

LevelEdge App is a Levels.fyi-inspired salary intelligence platform for exploring tech compensation, comparing companies, and generating AI-assisted negotiation guidance.

## Features

- Salary explorer with filters, sorting, and company/role views
- Side-by-side company comparison
- Salary submission flow
- AI Coach powered by Gemini when available
- Automatic simulated fallback when Gemini is unavailable or rate limited


## Background & Research

### Reference Platform Analysis

| Feature | Levels.fyi | 6figr | AmbitionBox | Glassdoor | **Build?** |
|---|---|---|---|---|---|
| Searchable salary tables | ✅ | ✅ | ✅ | ✅ | **✅ Yes** |
| Level-based comparison | ✅ | ❌ | ❌ | ❌ | **✅ Yes** |
| Company salary pages | ✅ | ✅ | ✅ | ✅ | **✅ Yes** |
| Side-by-side comparison | ✅ | ❌ | ✅ | ❌ | **✅ Yes** |
| Compensation visualizations | ✅ | ✅ | ✅ | ✅ | **✅ Yes** |
| Salary submission form | ✅ | ✅ | ✅ | ✅ | **✅ Yes** |
| AI-powered insights | ❌ | ❌ | ❌ | ❌ | **✅ Yes (Gemini)** |
| Authentication | ✅ | ✅ | ✅ | ✅ | ❌ Simplified |
| Job board | ✅ | ❌ | ✅ | ✅ | ❌ Out of scope |
| Negotiation tools | ✅ | ❌ | ❌ | ❌ | ❌ Out of scope |

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Express, TypeScript, MongoDB/Mongoose
- AI: Gemini API with a local rule-based fallback

## Getting Started

Install dependencies from the app root:

```bash
npm install
```

Start the full app in development mode:

```bash
npm run dev
```

Start only the backend:

```bash
npm run server
```

Build for production:

```bash
npm run build
```

Lint the project:

```bash
npm run lint
```

## Environment Variables

Create a `.env` file in the `compensation-app` root.

```bash
MONGODB_URI=your-mongodb-connection-string
VITE_GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
```

`VITE_GEMINI_API_KEY` is used by the server-side AI route. `GEMINI_MODEL` is optional and can be used to pin a specific model when your key has access to it.

## AI Behavior

The AI Coach uses the Gemini API first. If the key is missing, the model is rate limited, or Gemini returns an error, the app falls back to a simulated compensation advisor so the feature remains usable.

If you see repeated Gemini 404 responses, verify that the API key is valid and that it has access to the model configured in `GEMINI_MODEL` or the default fallback model list.

## Project Structure

- `server/` contains the Express API, MongoDB models, and the AI proxy route
- `src/` contains the React UI, pages, hooks, and shared components
- `data/` contains local salary/company seed data used by the app

## Notes

- Do not commit real API keys to source control.
- Run `npm run seed` if you need to repopulate the database or local fallback data.
