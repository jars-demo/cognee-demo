# Sample datasets

Each folder is one sample. Its name is also the **cognee dataset** it is remembered into, so the
folder and the dataset are always called the same thing. All three are fictional.

| Folder / dataset | What it is | Try asking |
|---|---|---|
| [`northwind_trails`](northwind_trails) | A small company that builds a hiking app | What is Project Riverbend blocked on? |
| [`meridian_space_lab`](meridian_space_lab) | A research lab with two satellite missions | Why is Mission Tidewatch delayed? |
| [`harbor_city_library`](harbor_city_library) | A community library with three branches | Who runs the Code Club? |

In the app, pick a sample in the **Remember** card, click **Load sample**, then **Remember**.

## Folder layout

```text
<dataset_name>/
├── about.json      title, description and suggested questions (shown in the app)
└── *.md            the documents, one per file; this is what cognee remembers
```

To add a sample, create a folder with a lowercase `snake_case` name, add an `about.json` like the
others and two or three short `.md` files. The app picks it up automatically.
