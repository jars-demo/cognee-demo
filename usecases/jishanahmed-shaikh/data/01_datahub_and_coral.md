# What DataHub and Coral are

## DataHub

DataHub is an open-source metadata platform, licensed under Apache 2.0 and hosted at
https://github.com/datahub-project/datahub. Teams use it as a data catalog: it records which
datasets exist, their schemas, who owns them, which domain they belong to, their tags and
glossary terms, and their lineage (which datasets feed which).

DataHub collects this metadata through ingestion sources. Each ingestion source connects DataHub
to one external system, such as a database, a vector store or an observability tool, and brings
that system's metadata into DataHub. DataHub can be self-hosted, and there is also a managed
version called DataHub Cloud.

## Coral

Coral is an open-source project, licensed under Apache 2.0 and hosted at
https://github.com/withcoral/coral. It gives AI agents one SQL interface over APIs, files and live
data sources. Instead of calling many separate tools, an agent asks Coral a SQL question, and Coral
fetches and joins the data from the connected sources.

Coral runs locally, so data and credentials stay on the user's machine. Agents connect to Coral
over MCP (the Model Context Protocol). Each system Coral can read from is added as a source, and
community members contribute new sources.
