# DocBot 🤖

> AI-powered documentation generator for GitHub repositories

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/docbot)
[![Made by Synthwork](https://img.shields.io/badge/Made%20by-Synthwork-purple)](https://synthwork.io)

Automatically generate and update documentation for your projects using AI. Stop writing READMEs manually.

## Quick Start

```yaml
name: Generate Docs
on: [push]

permissions:
  contents: write  # Required for auto-commit

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: SynthWorkIO/docbot@v1
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "docs: Update README [DocBot]"
```

## Features

- 🔍 **Smart Analysis** — Detects project type, dependencies, and structure
- ✨ **AI-Powered** — Generates human-quality documentation
- 🌐 **Multi-Language** — JavaScript, TypeScript, Python, Rust, Go
- ⚡ **Fast** — Runs in seconds
- 🔄 **Auto-Commit** — Pair with auto-commit action for fully automated docs

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `mode` | Generation mode: `readme`, `api`, or `full` | No | `readme` |
| `api-key` | OpenAI API key (or use env var) | No | - |
| `output-path` | Where to write generated docs | No | `.` |

## Modes

- **readme** — Generate/update README.md
- **api** — Generate API documentation (detects Express, FastAPI, etc.)
- **full** — Both README and API docs

## Works Without API Key

DocBot generates basic documentation even without an API key. Add `OPENAI_API_KEY` for AI-enhanced docs.

## Pricing

- **Free** — Basic README generation
- **Pro $9/mo** — Full API docs, GPT-4, priority support

[Get Pro →](https://buy.stripe.com/eVq3cw1uTeeOeUt3xHbMQ03)

## Example

See it in action: [docbot-test](https://github.com/SynthWorkIO/docbot-test)

## License

MIT © [Synthwork](https://synthwork.io)
