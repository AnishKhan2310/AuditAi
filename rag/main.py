"""
PDF Loader - Main Module with RAG Analysis
==========================================
This module provides RAG-based analysis to classify clauses as 
positive, negative, or neutral based on knowledge base similarity.
"""

import os
import sys
import threading
import datetime
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

# LangChain imports
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings


# ==================== GLOBAL VARIABLES ====================

current_upload = {
    'filename': None,
    'pages': 0,
    'chunks': 0,
    'word_count': 0,
    'analysis': None,
    'positive_clauses': [],
    'negative_clauses': [],
    'neutral_clauses': [],
    'timestamp': None
}

knowledge_base_store = None
knowledge_base_loaded = False


# ==================== FLASK APP SETUP ====================

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'notebook_uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# ==================== KNOWLEDGE BASE FUNCTIONS ====================

def load_knowledge_base():
    """Load the knowledge base from test1.pdf and test2.pdf"""
    global knowledge_base_store, knowledge_base_loaded
    
    if knowledge_base_loaded:
        return knowledge_base_store
    
    print("Loading knowledge base...")
    
    try:
        kb_dir = os.path.join(os.path.dirname(__file__), 'data', 'pdf')
        
        kb_docs = []
        
        test1_path = os.path.join(kb_dir, 'test1.pdf')
        test2_path = os.path.join(kb_dir, 'test2.pdf')
        
        if os.path.exists(test1_path):
            loader = PyPDFLoader(test1_path)
            docs = loader.load()
            kb_docs.extend(docs)
            print(f"Loaded {len(docs)} pages from test1.pdf")
        
        if os.path.exists(test2_path):
            loader = PyPDFLoader(test2_path)
            docs = loader.load()
            kb_docs.extend(docs)
            print(f"Loaded {len(docs)} pages from test2.pdf")
        
        if not kb_docs:
            print("No knowledge base documents found!")
            return None
        
        # Analyze each chunk to determine its category
        # Then add category to metadata
        for doc in kb_docs:
            content = doc.page_content.lower()
            if 'negative' in content or 'risk' in content or 'harmful' in content:
                doc.metadata['category'] = 'negative'
            elif 'positive' in content or 'safe' in content or 'benefit' in content:
                doc.metadata['category'] = 'positive'
            else:
                doc.metadata['category'] = 'neutral'
        
        # Split into chunks for embedding
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100,
        )
        split_docs = text_splitter.split_documents(kb_docs)
        
        # Re-categorize chunks after splitting
        for doc in split_docs:
            content = doc.page_content.lower()
            # Check for category indicators in the content
            if any(word in content for word in ['negative', 'risk', 'harmful', 'penalty', 'unlimited', 'waiver', 'indemnify']):
                doc.metadata['category'] = 'negative'
            elif any(word in content for word in ['positive', 'safe', 'benefit', 'protection', 'guarantee']):
                doc.metadata['category'] = 'positive'
            else:
                doc.metadata['category'] = 'neutral'
        
        print(f"Knowledge base split into {len(split_docs)} chunks")
        
        # Create embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        
        # Create Chroma vector store
        persist_dir = os.path.join(os.path.dirname(__file__), 'data', 'vector_store', 'knowledge_base')
        
        knowledge_base_store = Chroma.from_documents(
            documents=split_docs,
            embedding=embeddings,
            persist_directory=persist_dir
        )
        
        knowledge_base_loaded = True
        print("Knowledge base loaded successfully!")
        return knowledge_base_store
        
    except Exception as e:
        print(f"Error loading knowledge base: {e}")
        import traceback
        traceback.print_exc()
        return None


def analyze_document_with_rag(uploaded_documents, knowledge_store):
    """
    Analyze uploaded documents against knowledge base using similarity search.
    Returns positive, negative, neutral clause lists.
    """
    global current_upload
    
    if not knowledge_store:
        return None
    
    try:
        # Split uploaded document into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100,
        )
        chunks = text_splitter.split_documents(uploaded_documents)
        
        positive_clauses = []
        negative_clauses = []
        neutral_clauses = []
        
        # For each chunk, find similar clauses in knowledge base
        for chunk in chunks:
            # Search for similar content in knowledge base
            similar_docs = knowledge_store.similarity_search_with_score(
                chunk.page_content, 
                k=3  # Get top 3 similar documents
            )
            
            # Determine category based on most similar document
            category_votes = {'positive': 0, 'negative': 0, 'neutral': 0}
            
            for doc, score in similar_docs:
                # Lower score = more similar
                if score < 0.8:  # Similarity threshold
                    category = doc.metadata.get('category', 'neutral')
                    category_votes[category] = category_votes.get(category, 0) + 1
            
            # Determine dominant category
            dominant_category = max(category_votes, key=category_votes.get)
            
            clause_info = {
                'text': chunk.page_content[:300] + "..." if len(chunk.page_content) > 300 else chunk.page_content,
                'source_file': chunk.metadata.get('source_file', 'Unknown')
            }
            
            # Add to appropriate list based on category
            if dominant_category == 'negative' or category_votes['negative'] >= 2:
                negative_clauses.append(clause_info)
            elif dominant_category == 'positive' or category_votes['positive'] >= 2:
                positive_clauses.append(clause_info)
            else:
                neutral_clauses.append(clause_info)
        
        # Calculate risk score based on negative clauses percentage
        total = len(positive_clauses) + len(negative_clauses) + len(neutral_clauses)
        risk_percentage = int((len(negative_clauses) / total) * 100) if total > 0 else 0
        
        # Determine risk level
        if risk_percentage > 60:
            risk_level = "High Risk"
        elif risk_percentage > 40:
            risk_level = "Medium Risk"
        elif risk_percentage > 20:
            risk_level = "Low Risk"
        else:
            risk_level = "Safe"
        
        # Generate analysis result
        analysis = {
            'risk_score': risk_percentage,
            'total_clauses': total,
            'risk_clauses': len(negative_clauses),
            'safe_clauses': len(positive_clauses),
            'neutral_clauses': len(neutral_clauses),
            'risk_level': risk_level
        }
        
        return {
            'analysis': analysis,
            'positive_clauses': positive_clauses,
            'negative_clauses': negative_clauses,
            'neutral_clauses': neutral_clauses
        }
        
    except Exception as e:
        print(f"Error in RAG analysis: {e}")
        import traceback
        traceback.print_exc()
        return None


# ==================== PDF LOADING FUNCTIONS ====================

def load_pdf_from_uploads(filename: str):
    """Load a PDF file from the uploads folder."""
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found: {file_path}")
    
    print(f"Loading: {filename}")
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    for doc in documents:
        doc.metadata['source_file'] = filename
        doc.metadata['file_type'] = 'pdf'
    
    print(f"  [OK] Loaded {len(documents)} pages")
    return documents


def split_documents(documents, chunk_size=1000, chunk_overlap=200):
    """Split documents into smaller chunks."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    split_docs = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(split_docs)} chunks")
    return split_docs


# ==================== FLASK ROUTES ====================

@app.route('/upload', methods=['POST'])
def upload_pdf():
    """Upload endpoint with RAG-based clause classification."""
    global current_upload, knowledge_base_store
    
    if 'pdf_file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['pdf_file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith('.pdf'):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        print(f"--- File saved to: {file_path} ---")
        
        try:
            # Load and process the uploaded PDF
            documents = load_pdf_from_uploads(file.filename)
            chunks = split_documents(documents)
            word_count = sum(len(doc.page_content.split()) for doc in documents)
            
            # Load knowledge base if not loaded
            if not knowledge_base_loaded:
                knowledge_base_store = load_knowledge_base()
            
            # Perform RAG analysis
            result = analyze_document_with_rag(documents, knowledge_base_store)
            
            if result is None:
                return jsonify({
                    "success": False,
                    "message": "Could not perform analysis"
                }), 200
            
            analysis = result['analysis']
            
            # Update global current upload info
            current_upload['filename'] = file.filename
            current_upload['pages'] = len(documents)
            current_upload['chunks'] = len(chunks)
            current_upload['word_count'] = word_count
            current_upload['timestamp'] = datetime.datetime.now().isoformat()
            current_upload['analysis'] = analysis
            current_upload['positive_clauses'] = result['positive_clauses']
            current_upload['negative_clauses'] = result['negative_clauses']
            current_upload['neutral_clauses'] = result['neutral_clauses']
            
            return jsonify({
                "success": True,
                "message": f"Successfully uploaded {file.filename}",
                "filename": file.filename,
                "pages": len(documents),
                "chunks": len(chunks),
                "word_count": word_count,
                "analysis": analysis,
                "positive_clauses": result['positive_clauses'],
                "negative_clauses": result['negative_clauses'],
                "neutral_clauses": result['neutral_clauses']
            }), 200
            
        except Exception as e:
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({
                "success": False,
                "message": f"Error: {str(e)}"
            }), 200
    
    return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400


@app.route('/analysis', methods=['GET'])
def get_analysis():
    """Get current analysis data."""
    global current_upload
    
    if current_upload['filename'] is None:
        return jsonify({
            "error": "No file uploaded yet",
            "has_analysis": False
        }), 404
    
    return jsonify({
        "has_analysis": True,
        "filename": current_upload['filename'],
        "pages": current_upload['pages'],
        "chunks": current_upload['chunks'],
        "word_count": current_upload.get('word_count', 0),
        "timestamp": current_upload['timestamp'],
        "analysis": current_upload['analysis'],
        "positive_clauses": current_upload.get('positive_clauses', []),
        "negative_clauses": current_upload.get('negative_clauses', []),
        "neutral_clauses": current_upload.get('neutral_clauses', [])
    }), 200


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "service": "PDF Loader API",
        "knowledge_base_loaded": knowledge_base_loaded
    }), 200


# ==================== SERVER FUNCTIONS ====================

def run_app(host='0.0.0.0', port=5000, debug=False):
    """Run the Flask application."""
    app.run(host=host, port=port, debug=debug, use_reloader=False)


def start_server_thread(host='0.0.0.0', port=5000, debug=False):
    """Start the Flask server in a separate thread."""
    flask_thread = threading.Thread(target=run_app, kwargs={
        'host': host, 
        'port': port, 
        'debug': debug
    })
    flask_thread.daemon = True
    flask_thread.start()
    return flask_thread


# ==================== MAIN FUNCTION ====================

def main():
    """Main function."""
    print("=" * 50)
    print("PDF Loader - RAG Clause Classification")
    print("=" * 50)
    
    # Pre-load knowledge base
    print("\n[INFO] Loading knowledge base...")
    knowledge_base_store = load_knowledge_base()
    
    # Start Flask server
    print("\n" + "=" * 50)
    print("Starting Flask Server")
    print("=" * 50)
    print(f"Server running on http://127.0.0.1:5000")
    print("Available endpoints:")
    print("  - POST /upload - Upload PDF (with clause classification)")
    print("  - GET  /analysis - Get classification results")
    print("  - GET  /health - Health check")
    print("=" * 50)
    
    try:
        run_app(debug=True)
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)


if __name__ == "__main__":
    main()
