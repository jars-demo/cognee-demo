# 07 · Build your own use case (15 min)

Now give cognee *your* data and share what you built with a pull request.

## 1. Fork and branch

1. Click **Fork** on this repo's GitHub page, then clone your fork.
2. Create a branch:

   ```bash
   git checkout -b usecase/<your-github-handle>
   ```

## 2. Copy the template

```bash
cp -r usecases/_template usecases/<your-github-handle>
# Windows PowerShell: Copy-Item -Recurse usecases/_template usecases/<your-github-handle>
```

## 3. Add your data

Delete `data/example.md` and put one or more `.md` or `.txt` files in your `data/` folder.

Ideas: notes about a hobby, a sports team's season, a short history of your city, a project
README, a recipe collection. **Only share data you are allowed to share: nothing personal,
private or confidential.** Short, fact-rich text works best (under about 2,000 words).

## 4. Write your questions and run

Edit `QUESTIONS` in your `run.py`, ideally one question that needs two facts connected. Then:

```bash
docker compose exec backend python usecases/<your-github-handle>/run.py   # Docker
uv run python usecases/<your-github-handle>/run.py                        # running locally
```

`run.py` stores your data in the dataset `usecase_<your-github-handle>`. To see its graph in
the app, type that name into the **Dataset** box and click **Load graph**.

## 5. Write it up

Fill in your `README.md`: what you built, the questions, what came back, and what you learned.
Add a row for your use case to [`usecases/README.md`](../usecases/README.md).

## 6. Open a pull request

```bash
git add usecases/<your-github-handle> usecases/README.md
git commit -m "feat(usecases): Add <short title> use case"
git push -u origin usecase/<your-github-handle>
```

Open a pull request from your branch to this repo's `main` and fill in the template. The
checklist is in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Going further

- Add a Groq key (step 5) and compare the graphs.
- Point the app at [Cognee Cloud](https://docs.cognee.ai/cognee-cloud/overview) with
  `python scripts/setup.py` (option 4).
- Read the [cognee docs](https://docs.cognee.ai/) and the
  [cognee repo](https://github.com/topoteretes/cognee).
