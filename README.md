# DocBot 🤖

> AI-powered documentation generator for GitHub repositories

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/docbot)
[![Made by Synthwork](https://img.shields.io/badge/Made%20by-Synthwork-purple)](https://synthwork.io)

Automatically generate and update documentation for your projects using AI. Stop writing READMEs manually.

## Quick Start

```yaml
name: Generate Docs
on: [push]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: synthwork/docbot@v1
        with:
          mode: 'readme'
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

## Pricing

- **Free** — Basic README generation (uses gpt-3.5-turbo)
- **Pro $9/mo** — Full API docs, GPT-4, priority support

[Get Pro →](https://synthwork.io/docbot/pro)

## Examples

See generated READMEs:
- [Example Node.js Project](examples/nodejs)
- [Example Python Project](examples/python)

## License

MIT © [Synthwork](https://synthwork.io)
