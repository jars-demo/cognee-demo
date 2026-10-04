"""API tests. The cognee layer (app/backend/services/memory.py) is faked: no models or keys."""

import pytest
from fastapi.testclient import TestClient

from app.backend import main
from app.backend.services import memory, transforms


@pytest.fixture
def client(monkeypatch):
    calls = []

    async def fake_connect(settings):
        calls.append(("connect", settings.mode))

    async def fake_remember(documents, dataset):
        calls.append(("remember", documents, dataset))

    async def fake_recall(question, dataset, search_type=None):
        calls.append(("recall", question, dataset, search_type))
        return [{"text": "Ravi Patel maintains it.", "source": "graph", "search_type": "CHUNKS"}]

    async def fake_graph(dataset, settings):
        return transforms.graph(
            {
                "nodes": [
                    {"id": "1", "name": "Ravi Patel", "type": "Entity"},
                    {"id": "2", "name": "offline maps service", "type": "Entity"},
                ],
                "links": [
                    {"source": "1", "target": "2", "relation": "maintains"},
                    {"source": "1", "target": "missing", "relation": "dangling"},
                ],
            }
        )

    async def fake_forget(dataset):
        calls.append(("forget", dataset))

    for name, fake in {
        "connect": fake_connect,
        "remember": fake_remember,
        "recall": fake_recall,
        "graph": fake_graph,
        "forget": fake_forget,
    }.items():
        monkeypatch.setattr(memory, name, fake)
    monkeypatch.delenv("LLM_API_KEY", raising=False)
    monkeypatch.delenv("COGNEE_SERVICE_URL", raising=False)

    with TestClient(main.create_app()) as test_client:
        test_client.calls = calls
        yield test_client


def test_status_reports_local_mode(client):
    body = client.get("/api/status").json()
    assert body["mode"] == "local"
    assert body["llm_available"] is False


def test_remote_mode_comes_from_service_url(client, monkeypatch):
    monkeypatch.setenv("COGNEE_SERVICE_URL", "http://localhost:8001/")
    assert client.get("/api/status").json()["mode"] == "remote"


def test_samples_list_every_data_folder(client):
    body = client.get("/api/samples").json()
    assert body["default"] == "northwind_trails"
    names = [sample["dataset"] for sample in body["samples"]]
    assert names == ["harbor_city_library", "meridian_space_lab", "northwind_trails"]
    assert all(sample["files"] == 3 and len(sample["questions"]) == 3 for sample in body["samples"])


def test_sample_text_has_one_document_per_file(client):
    body = client.get("/api/samples/meridian_space_lab").json()
    assert body["dataset"] == "meridian_space_lab"
    assert body["text"].count("\n---\n") == 2
    assert "Meridian Space Lab" in body["text"]


def test_unknown_or_unsafe_sample_is_404(client):
    assert client.get("/api/samples/nope").status_code == 404
    assert client.get("/api/samples/..").status_code == 404


def test_remember_splits_documents_on_separator(client):
    text = "first doc\n---\nsecond doc\n\n---\n\n"
    assert client.post("/api/remember", json={"text": text, "dataset": "ds"}).status_code == 200
    assert client.calls[-1] == ("remember", ["first doc", "second doc"], "ds")


def test_dataset_names_are_validated(client):
    response = client.post("/api/remember", json={"text": "x", "dataset": "../etc"})
    assert response.status_code == 422


def test_recall_passes_search_type(client):
    response = client.post(
        "/api/recall", json={"question": "who?", "dataset": "ds", "search_type": "chunks"}
    )
    assert response.status_code == 200
    assert client.calls[-1] == ("recall", "who?", "ds", "CHUNKS")


def test_llm_search_type_is_refused_without_a_key(client):
    response = client.post(
        "/api/recall", json={"question": "who?", "search_type": "GRAPH_COMPLETION"}
    )
    assert response.status_code == 400
    assert "Groq" in response.json()["detail"]


def test_unknown_search_type_is_rejected(client):
    response = client.post("/api/recall", json={"question": "who?", "search_type": "NOPE"})
    assert response.status_code == 400


def test_graph_drops_edges_to_unknown_nodes(client):
    body = client.get("/api/graph", params={"dataset": "ds"}).json()
    assert [n["label"] for n in body["nodes"]] == ["Ravi Patel", "offline maps service"]
    assert body["edges"] == [{"source": "1", "target": "2", "label": "maintains"}]


def test_forget_calls_cognee(client):
    assert client.post("/api/forget", json={"dataset": "ds"}).status_code == 200
    assert client.calls[-1] == ("forget", "ds")


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_defaults_to_the_sample_dataset(client):
    client.post("/api/forget", json={})
    assert client.calls[-1] == ("forget", "northwind_trails")


def test_remote_missing_llm_key_becomes_a_friendly_400(client, monkeypatch):
    async def remote_without_key(question, dataset, search_type=None):
        raise RuntimeError(
            'Remote recall failed (422): "LLM API key is not set. [LLMAPIKeyNotSetError]"'
        )

    monkeypatch.setattr(memory, "recall", remote_without_key)
    response = client.post(
        "/api/recall", json={"question": "who?", "search_type": "GRAPH_COMPLETION"}
    )
    assert response.status_code == 400
    assert "Groq" in response.json()["detail"]


def test_unknown_dataset_becomes_a_friendly_404(client, monkeypatch):
    async def missing(question, dataset, search_type=None):
        raise RuntimeError("Dataset(s) not found: 'x'. [DatasetNotFoundError]")

    monkeypatch.setattr(memory, "recall", missing)
    response = client.post("/api/recall", json={"question": "who?", "dataset": "x"})
    assert response.status_code == 404
    assert "Remember first" in response.json()["detail"]


def test_graph_is_scoped_to_the_datasets_documents():
    """On a shared graph, only this dataset's documents, chunks and their entities remain."""
    data = {
        "nodes": [
            {"id": "doc-a", "type": "TextDocument", "name": "a"},
            {"id": "doc-b", "type": "TextDocument", "name": "b"},
            {"id": "chunk-a", "type": "DocumentChunk", "document_id": "doc-a"},
            {"id": "chunk-b", "type": "DocumentChunk", "document_id": "doc-b"},
            {"id": "ravi", "type": "Entity", "name": "ravi patel"},
            {"id": "lumen", "type": "Entity", "name": "mission lumen"},
            {"id": "person", "type": "EntityType", "name": "person"},
        ],
        "links": [
            {"source": "chunk-a", "target": "doc-a", "relation": "is_part_of"},
            {"source": "chunk-b", "target": "doc-b", "relation": "is_part_of"},
            {"source": "chunk-a", "target": "ravi", "relation": "contains"},
            {"source": "chunk-b", "target": "lumen", "relation": "contains"},
            {"source": "ravi", "target": "person", "relation": "is_a"},
        ],
    }
    scoped = transforms.graph(data, {"doc-a"})
    assert {n["id"] for n in scoped["nodes"]} == {"doc-a", "chunk-a", "ravi", "person"}
    assert all(e["source"] != "chunk-b" for e in scoped["edges"])


def test_forget_missing_ok_ignores_an_unknown_dataset(monkeypatch):
    import asyncio

    async def not_found(dataset):
        raise RuntimeError("Dataset 'x' not found. [DatasetNotFoundError]")

    monkeypatch.setattr(memory.cognee, "forget", not_found)
    asyncio.run(memory.forget("x", missing_ok=True))  # no error
    with pytest.raises(RuntimeError):
        asyncio.run(memory.forget("x"))
