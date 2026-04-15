<div align="center">

<img src="https://img.shields.io/badge/AuditAi-Intelligence%20for%20Audit-0f172a?style=for-the-badge&logoColor=white" alt="AuditAi" height="40"/>

<br/>
<br/>

[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-F37626?style=flat-square&logo=jupyter&logoColor=white)](https://jupyter.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br/>

**AuditAi** is an AI-powered auditing platform that combines a Retrieval-Augmented Generation (RAG) pipeline with a web-based interface to deliver intelligent, context-aware audit analysis at scale.

</div>

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
- [Credits](#credits)
- [Contributing](#contributing)

---

## Overview

AuditAi streamlines the audit process by enabling natural language querying over large document corpora. It ingests audit-relevant documents, indexes them into a vector store, and uses a large language model to answer queries with citations grounded in the source material.

The platform is composed of three tightly integrated components:

- **Backend** — A Python-based API server that handles request routing and LLM orchestration.
- **Frontend** — A browser-based interface for submitting queries, uploading documents, and reviewing findings.
- **RAG Pipeline** — A Jupyter Notebook-driven pipeline for document ingestion, embedding, and vector-indexed retrieval.

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
├── Backend/          # Python API server — request handling and LLM integration
├── frontend/         # JavaScript web application for user interaction
├── rag/              # RAG pipeline notebooks for document ingestion and retrieval
└── .gitignore
```

### Backend

The backend exposes REST API endpoints that receive queries from the frontend, interface with the RAG pipeline, and return AI-generated audit responses. It manages the bridge between the language model and the vector store.

### Frontend

The frontend provides a browser-based interface for users to submit audit queries, upload documents, and review generated findings. It communicates with the backend over HTTP.

### RAG Pipeline

The `rag/` directory contains Jupyter Notebooks responsible for document preprocessing, embedding generation, vector store indexing, and retrieval logic. This pipeline forms the knowledge base that the language model queries against.

---

## Prerequisites

Ensure the following are installed on your system before proceeding:

| Requirement | Version |
|---|---|
| Python | 3.9 or higher |
| Node.js + npm | 18 or higher |
| Jupyter Notebook / JupyterLab | Latest stable |
| Vector store | As specified in RAG notebooks |
| LLM API credentials | Provider-specific |

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

Open the notebooks in JupyterLab or Jupyter Notebook and follow the in-notebook instructions to ingest and index your documents.

---

## Configuration

Create a `.env` file inside the `Backend/` directory and populate it with your environment-specific values:

```env
LLM_API_KEY=your_api_key_here
VECTOR_STORE_PATH=./vector_store
MODEL_NAME=your_model_name
PORT=8000
```

Refer to the backend source and RAG notebooks for any additional configuration required by your deployment environment.

---

## Running the Application

### Start the Backend Server

```bash
cd Backend
source venv/bin/activate        # On Windows: venv\Scripts\activate
python app.py
```

The API server will be available at `http://localhost:8000` by default.

### Start the Frontend

```bash
cd frontend
npm start
```

The web interface will be available at `http://localhost:3000`.

### Run the RAG Pipeline

```bash
cd rag
jupyter notebook
```

Execute the notebooks in sequence to ingest your documents and build the vector index prior to querying.

---

## Usage

1. Confirm the backend server is running at `http://localhost:8000`.
2. Run the RAG pipeline notebooks to index your audit documents into the vector store.
3. Open the frontend in a browser at `http://localhost:3000`.
4. Upload documents or point the pipeline to a document source as instructed in the notebooks.
5. Submit natural language queries scoped to your audit domain.
6. Review AI-generated responses, each grounded in and traceable to the indexed source documents.

---

## Technology Stack

| Layer | Technology |
|---|---|
| RAG Pipeline | [![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/) [![Jupyter](https://img.shields.io/badge/-Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white)](https://jupyter.org/) |
| Backend | [![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/) |
| Frontend | [![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) |
| Retrieval | Vector store (configured in RAG notebooks) |
| Language Model | Configurable via environment variable |

---

## Credits

AuditAi was designed and developed by a team of four contributors across two primary workstreams.

| Contributor | Role |
|---|---|
| **Anish Khan** | RAG Pipeline Architecture, Frontend Contributions |
| **Prakhar Dhangar** | RAG Pipeline Development, Frontend Contributions |
| **Soumyajit Chaudhury** | Frontend Development, Backend, Database & Authentication |
| **Aditya Ankur** | Frontend Development, Backend, Database & Authentication |

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes with a descriptive message:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
4. Push the branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request against the `main` branch of this repository.

Please ensure your code is well-documented and that any new dependencies are reflected in the appropriate `requirements.txt` or `package.json` file.

---

<div align="center">

[![GitHub](https://img.shields.io/badge/View%20on%20GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/AnishKhan2310/AuditAi)

</div>
