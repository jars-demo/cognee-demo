# Jishanahmed AR Shaikh's proposed cognee connectors

For the Mergetober hackathon, Jishanahmed AR Shaikh proposed two new data-source connectors for
cognee, the open-source memory engine this workshop is about. Both would live in the
cognee-community repository as dlt sources.

## Apache Airflow connector

Issue: https://github.com/topoteretes/cognee/issues/5359. Status: open proposal.
It would read DAGs, tasks and their dependencies from the Airflow 3 REST API, so an agent can ask
which task runs before another or who owns a DAG. It builds on his Apache Airflow source for Coral.

## DataHub connector

Issue: https://github.com/topoteretes/cognee/issues/5360. Status: open proposal.
It would read datasets, owners, domains, tags, glossary terms and lineage through DataHub's
GraphQL API, so cognee can answer questions about an organization's data. It builds on his DataHub
source for Coral and on his DataHub ingestion sources for Pinecone and Langfuse.
