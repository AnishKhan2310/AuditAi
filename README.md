# AuditAi

AuditAi is an AI-powered auditing platform that combines a Retrieval-Augmented Generation (RAG) pipeline with a web-based interface to deliver intelligent, context-aware audit analysis. The system is designed to assist auditors and compliance teams by automating document review, surfacing relevant insights, and generating structured audit findings.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)

---

## Overview

AuditAi streamlines the audit process by enabling natural language querying over large document corpora. It ingests audit-relevant documents, indexes them into a vector store, and uses a large language model to answer queries with citations grounded in the source material. The platform consists of three components: a Python-based backend API, a JavaScript frontend, and a Jupyter-Notebook-driven RAG pipeline for document ingestion and retrieval.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend                         │
│              (JavaScript / Web Interface)               │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP / REST
┌───────────────────────────▼─────────────────────────────┐
│                        Backend                          │
│                (Python / API Server)                    │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                      RAG Pipeline                       │
│         (Document Ingestion, Embedding, Retrieval)      │
│              (Jupyter Notebooks / Python)               │
└─────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
AuditAi/
├── Backend/          # Python API server handling requests and LLM integration
├── frontend/         # JavaScript web application for user interaction
├── rag/              # RAG pipeline notebooks for document ingestion and retrieval
└── .gitignore
```

### Backend

The backend exposes REST API endpoints that receive queries from the frontend, interact with the RAG pipeline, and return AI-generated audit responses. It manages the interface between the language model and the vector store.

### Frontend

The frontend provides a browser-based interface for users to submit audit queries, upload documents, and review generated findings. It communicates with the backend over HTTP.

### RAG Pipeline

The RAG directory contains Jupyter Notebooks that handle document preprocessing, embedding generation, vector store indexing, and retrieval logic. This pipeline forms the knowledge base that the language model queries against.

---

## Prerequisites

Ensure the following are installed on your system before proceeding:

- Python 3.9 or higher
- Node.js 18 or higher and npm
- Jupyter Notebook or JupyterLab
- A supported vector store (refer to the RAG notebook for specifics)
- API credentials for your chosen language model provider

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AnishKhan2310/AuditAi.git
cd AuditAi
```

### 2. Set Up the Backend

```bash
cd Backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
```

### 4. Set Up the RAG Pipeline

```bash
cd ../rag
pip install -r requirements.txt   # if a requirements file is present
```

Open the notebooks in JupyterLab or Jupyter Notebook and follow the instructions within each notebook to ingest and index your documents.

---

## Configuration

Create a `.env` file in the `Backend/` directory and populate it with your environment-specific values:

```env
LLM_API_KEY=your_api_key_here
VECTOR_STORE_PATH=./vector_store
MODEL_NAME=your_model_name
PORT=8000
```

Refer to the backend source and RAG notebooks for any additional configuration options required by your deployment.

---

## Running the Application

### Start the Backend Server

```bash
cd Backend
source venv/bin/activate        # On Windows: venv\Scripts\activate
python app.py
```

The API server will start on `http://localhost:8000` by default.

### Start the Frontend

```bash
cd frontend
npm start
```

The web interface will be available at `http://localhost:3000`.

### Run the RAG Pipeline

Open the notebooks in the `rag/` directory using Jupyter:

```bash
cd rag
jupyter notebook
```

Execute the notebooks in sequence to ingest documents and build the vector index before querying.

---

## Usage

1. Launch the backend server and confirm it is running.
2. Run the RAG pipeline notebooks to index your audit documents into the vector store.
3. Open the frontend in a browser at `http://localhost:3000`.
4. Upload documents or point the pipeline to a document source as instructed.
5. Submit natural language queries related to your audit scope.
6. Review the AI-generated responses, which are grounded in the indexed source documents.

---

## Technology Stack

| Layer | Technology |
|---|---|
| RAG Pipeline | Python, Jupyter Notebook |
| Backend | Python |
| Frontend | JavaScript |
| Retrieval | Vector store (configured in RAG notebooks) |
| Language Model | Configurable via environment variable |

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix: `git checkout -b feature/your-feature-name`
3. Commit your changes with a descriptive message: `git commit -m "Add feature: your feature description"`
4. Push the branch to your fork: `git push origin feature/your-feature-name`
5. Open a pull request against the `main` branch of this repository.

Please ensure your code is well-documented and that any new dependencies are reflected in the appropriate `requirements.txt` or `package.json` file.

---

