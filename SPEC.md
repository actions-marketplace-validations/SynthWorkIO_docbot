# DocBot Implementation Spec

## Goal
Build a GitHub Action that analyzes code and generates documentation.

## Core Components

### 1. Code Analyzer (src/analyzer.ts)
- Parse repository structure
- Extract:
  - Package.json / Cargo.toml / pyproject.toml for metadata
  - Source files for function signatures
  - Existing README for context
- Output structured data about the project

### 2. Doc Generator (src/generator.ts)
- Take analyzed data
- Generate markdown documentation
- Modes:
  - `readme`: Basic README with install, usage, examples
  - `api`: Endpoint documentation (detect Express/FastAPI/etc)
  - `full`: Both + changelog template

### 3. GitHub Action Entry (src/index.ts)
- Read inputs from action.yml
- Run analyzer on repo
- Call generator
- Write output files
- Set outputs for workflow

### 4. AI Integration (src/ai.ts)
- Use OpenAI-compatible API
- Fallback: OpenRouter for variety
- For free tier: Use smaller/free models
- For Pro: Use GPT-4o or Claude

## Tech Stack
- TypeScript
- @actions/core, @actions/github
- @vercel/ncc for bundling
- openai SDK for AI calls

## File Structure
```
docbot/
├── src/
│   ├── index.ts      # Action entry
│   ├── analyzer.ts   # Code analysis
│   ├── generator.ts  # Doc generation
│   └── ai.ts         # AI API wrapper
├── action.yml
├── package.json
├── tsconfig.json
└── dist/             # Bundled output
```

## Implementation Priority
1. Get basic README generation working
2. Bundle and test locally
3. Add API docs mode
4. Add Pro tier API key validation
