# Jishanahmed AR Shaikh's DataHub ingestion sources

Jishanahmed AR Shaikh built two ingestion sources for DataHub.

## Pinecone source

The Pinecone source brings metadata from Pinecone, a vector database, into DataHub, so Pinecone
indexes appear in the DataHub catalog next to the rest of an organization's data.
Pull request: https://github.com/datahub-project/datahub/pull/16472. Status: merged.

## Langfuse source

The Langfuse source brings metadata from Langfuse, an LLM observability platform, into DataHub.
Pull request: https://github.com/datahub-project/datahub/pull/19923. Status: approved by a DataHub
maintainer, awaiting merge.

## Both directions

Pinecone and Langfuse are connected in both directions of his work: he built a Coral source for
each of them, and a DataHub ingestion source for each of them. DataHub itself also has a Coral
source by him, so Coral can read from DataHub too.
