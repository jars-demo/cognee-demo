# 00 · Prerequisites

Do this **before** the workshop: about 10 minutes, mostly downloads.

## 1. Tools

| Tool | Needed for | Get it |
|---|---|---|
| Docker Desktop | Running the stack (recommended) | [docs.docker.com/get-docker](https://docs.docker.com/get-docker/) |
| Git | Cloning and your pull request | [git-scm.com](https://git-scm.com/downloads) |
| GitHub account | Step 7 | [github.com/signup](https://github.com/signup) |
| Python 3.10–3.13 + [uv](https://docs.astral.sh/uv/getting-started/installation/), Node 22.12+ | Only for options 2–4, or editing code | [python.org](https://www.python.org/downloads/), [nodejs.org](https://nodejs.org/) |

## 2. Choose how to run cognee

| Option | Account needed | Graph built by | Answers |
|---|---|---|---|
| **1 · Docker** (default) | None | Local GLiNER model | Best-matching passages |
| … + free Groq key | [Groq](https://console.groq.com/keys) | LLM (Groq) | LLM-written answers |
| **4 · Cognee Cloud** | [Cognee Cloud](https://docs.cognee.ai/cognee-cloud/overview) | The cloud instance | Depends on the instance |

More: [installing cognee](https://docs.cognee.ai/getting-started/installation) ·
[LLM providers](https://docs.cognee.ai/setup-configuration/llm-providers).

## 3. Start it

```bash
git clone https://github.com/<you>/cognee-demo.git && cd cognee-demo   # your fork, see step 7
docker compose up -d --build
```

Or run `python scripts/setup.py` to be guided through any option (and to add a Groq key).

Open <http://localhost:3000/?workshop>. To warm up the models before the workshop, click
**Load sample data → Remember** once: the first run downloads about 1 GB into a Docker volume.

Stuck? See [Troubleshooting](./troubleshooting.md).

Next: [01 · Meet cognee](./01-meet-cognee.md)
