# cognee-demo backend. Build context is the repo root (see docker-compose.yml).
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /srv

# Dependencies first, so code changes do not reinstall them.
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/__init__.py app/__main__.py ./app/
COPY app/backend ./app/backend
COPY data ./data

RUN useradd --create-home demo && chown -R demo /srv
USER demo

EXPOSE 8000
CMD ["python", "-m", "app", "--host", "0.0.0.0", "--port", "8000"]
