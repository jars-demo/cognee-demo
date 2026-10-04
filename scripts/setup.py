"""One-step setup for cognee-demo.

    python scripts/setup.py

Asks how you want to run the demo, writes .env, installs what that option needs and starts it.
Standard library only, so it runs before anything is installed. Press Enter to accept defaults.

Options:
    docker  Everything in Docker: cognee + backend + frontend (default, needs only Docker)
    dev     cognee in Docker, backend + frontend run locally with hot reload (for code changes)
    local   No Docker: cognee runs inside the backend process, frontend built locally
    cloud   Backend + frontend locally, memory in Cognee Cloud (or any remote cognee server)

Non-interactive:  python scripts/setup.py --mode docker --yes   (add --groq-key gsk_... for LLM)
"""

import argparse
import getpass
import os
import shutil
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FRONTEND = ROOT / "app" / "frontend"
ENV_FILE = ROOT / ".env"
VENV_PYTHON = ROOT / ".venv" / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
COGNEE_DOCKER_URL = "http://localhost:8001"
GROQ_MODEL = "groq/openai/gpt-oss-120b"

MODES = {
    "docker": "Everything in Docker: cognee + backend + frontend (recommended, needs only Docker)",
    "dev": "Develop: cognee in Docker, backend + frontend locally with hot reload",
    "local": "No Docker: cognee runs inside the backend (needs Python + Node)",
    "cloud": "Cognee Cloud: memory in the cloud, backend + frontend locally",
}


# ---------- helpers ----------


def title(text: str) -> None:
    print(f"\n\033[1m{text}\033[0m")


def info(text: str) -> None:
    print(f"  {text}")


def fail(text: str) -> None:
    print(f"\n  \033[31mx {text}\033[0m")
    sys.exit(1)


def ask(question: str, default: str = "", secret: bool = False) -> str:
    prompt = f"  {question}{f' [{default}]' if default and not secret else ''}: "
    answer = getpass.getpass(prompt) if secret else input(prompt)
    return answer.strip() or default


def confirm(question: str, default: bool, assume_yes: bool) -> bool:
    if assume_yes:
        return default
    answer = ask(f"{question} ({'Y/n' if default else 'y/N'})").lower()
    return default if not answer else answer.startswith("y")


def run(command: list[str], cwd: Path = ROOT) -> None:
    info("$ " + " ".join(command))
    if subprocess.call(command, cwd=cwd, shell=os.name == "nt" and command[0] == "npm") != 0:
        fail(f"Command failed: {' '.join(command)}")


def require(tool: str, url: str) -> None:
    if not shutil.which(tool):
        fail(f"{tool} is not installed. Get it here: {url}")


def wait_for(url: str, what: str, minutes: int = 10) -> None:
    info(f"Waiting for {what} at {url} (the first start can take a few minutes)…")
    deadline = time.time() + minutes * 60
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=5) as response:
                if response.status == 200:
                    info(f"{what} is up.")
                    return
        except OSError:
            pass
        time.sleep(5)
    fail(f"{what} did not come up. Check: docker compose logs")


def python_command() -> list[str]:
    return ["uv", "run", "--no-sync", "python"] if shutil.which("uv") else [str(VENV_PYTHON)]


# ---------- steps ----------


def choose_mode(args: argparse.Namespace) -> str:
    title("1/3  How do you want to run the demo?")
    if args.mode:
        info(MODES[args.mode])
        return args.mode
    keys = list(MODES)
    for number, key in enumerate(keys, start=1):
        info(f"{number}) {MODES[key]}")
    while True:
        answer = ask("Choose 1-4", "1")
        if answer in {"1", "2", "3", "4"}:
            return keys[int(answer) - 1]


def write_env(mode: str, args: argparse.Namespace) -> None:
    title("2/3  Writing .env")
    lines = [
        "# Written by scripts/setup.py. Re-run it to switch modes; .env.example explains every",
        f"# setting. Mode: {mode}",
        "",
        "AUTO_FEEDBACK=false",
        "ENABLE_BACKEND_ACCESS_CONTROL=false",
        "TELEMETRY_DISABLED=1",
        "",
    ]
    if mode in {"docker", "dev"}:
        lines += [
            "# Backend run locally -> cognee in Docker. (Inside Docker this is overridden.)",
            f'COGNEE_SERVICE_URL="{COGNEE_DOCKER_URL}"',
        ]
    if mode == "cloud":
        info("Find both on the API Keys page of https://platform.cognee.ai")
        url = args.url or ask("Instance URL (https://<tenant>.aws.cognee.ai)")
        if not url.startswith(("http://", "https://")):
            fail("The URL must start with https://")
        key = args.api_key if args.api_key is not None else ask("API key", secret=True)
        lines += [f'COGNEE_SERVICE_URL="{url.rstrip("/")}"', f'COGNEE_API_KEY="{key}"']
    else:
        groq = args.groq_key
        if groq is None and not args.yes:
            info("Optional: a free Groq key gives LLM-built graphs and LLM-written answers.")
            groq = ask("Groq key from https://console.groq.com/keys (Enter to skip)", secret=True)
        if groq:
            if not groq.startswith("gsk_"):
                fail("That does not look like a Groq key (they start with gsk_).")
            lines += [
                "",
                "# LLM: Groq. Embeddings stay local, because Groq has no embedding models.",
                f'LLM_API_KEY="{groq}"',
                'LLM_PROVIDER="custom"',
                f'LLM_MODEL="{GROQ_MODEL}"',
                'LLM_ENDPOINT="https://api.groq.com/openai/v1"',
                'EMBEDDING_PROVIDER="fastembed"',
                'EMBEDDING_MODEL="BAAI/bge-small-en-v1.5"',
                "EMBEDDING_DIMENSIONS=384",
                "# Groq's free tier allows about 8,000 tokens per minute: pace the requests.",
                "LLM_RATE_LIMIT_ENABLED=true",
                "LLM_RATE_LIMIT_REQUESTS=4",
                "LLM_RATE_LIMIT_INTERVAL=60",
            ]
    if ENV_FILE.exists():
        if not confirm(".env exists. Replace it (old one kept as .env.backup)?", True, args.yes):
            info("Keeping your .env.")
            return
        shutil.copy(ENV_FILE, ROOT / ".env.backup")
    ENV_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")
    info("Wrote .env")


def install_backend() -> None:
    if shutil.which("uv"):
        run(["uv", "sync", "--inexact"])  # --inexact keeps the model runtime cognee adds later
        return
    if not (3, 10) <= sys.version_info[:2] <= (3, 13):
        fail("Use Python 3.10-3.13, or install uv: https://docs.astral.sh/uv/")
    if not VENV_PYTHON.exists():
        run([sys.executable, "-m", "venv", ".venv"])
    run([str(VENV_PYTHON), "-m", "pip", "install", "-r", "requirements.txt"])


def install_frontend(build: bool) -> None:
    require("npm", "https://nodejs.org/ (version 22.12 or newer)")
    run(["npm", "install", "--no-fund", "--no-audit"], cwd=FRONTEND)
    if build:
        run(["npm", "run", "build"], cwd=FRONTEND)


def start(mode: str, args: argparse.Namespace) -> None:
    title("3/3  Installing and starting")
    py = " ".join(python_command())
    if mode == "docker":
        require("docker", "https://docs.docker.com/get-docker/")
        run(["docker", "compose", "up", "-d", "--build"])
        wait_for("http://localhost:8000/health", "backend")
        title("Done! Open http://localhost:3000/#/workshop")
        info("Stop:  docker compose down      Logs:  docker compose logs -f")
        return

    install_backend()
    if mode == "dev":
        require("docker", "https://docs.docker.com/get-docker/")
        install_frontend(build=False)
        run(["docker", "compose", "up", "-d", "cognee"])
        wait_for(f"{COGNEE_DOCKER_URL}/health", "cognee")
    else:
        install_frontend(build=True)

    if not args.no_check:
        info("Checking cognee end to end (first run downloads local models)…")
        run([*python_command(), "scripts/check_setup.py"])

    title("Done!")
    if mode == "dev":
        info(f"Terminal 1 (backend):   {py} -m app --reload")
        info("Terminal 2 (frontend):  cd app/frontend && npm run dev")
        info("Open http://localhost:5173/#/workshop")
    else:
        info(f"Start the app:  {py} -m app     then open http://localhost:8000/#/workshop")


def main() -> None:
    parser = argparse.ArgumentParser(description="Set up cognee-demo.")
    parser.add_argument("--mode", choices=list(MODES))
    parser.add_argument("--groq-key")
    parser.add_argument("--url", help="Cognee Cloud instance URL")
    parser.add_argument("--api-key", help="Cognee Cloud API key")
    parser.add_argument("--yes", action="store_true", help="Accept all defaults")
    parser.add_argument("--no-check", action="store_true", help="Skip the end-to-end check")
    args = parser.parse_args()

    if os.name == "nt":
        os.system("")  # enables colours in the classic Windows console
    sys.stdout.reconfigure(errors="replace")
    print("\033[1mcognee-demo setup\033[0m")
    mode = choose_mode(args)
    write_env(mode, args)
    start(mode, args)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n  Setup cancelled.")
        sys.exit(130)
