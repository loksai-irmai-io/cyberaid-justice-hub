
# CyberAID Backend

This is the backend server for the CyberAID incident reporting system.

## Requirements

- Python 3.8+
- FastAPI
- EasyOCR
- Neo4j
- FPDF
- Google Generative AI SDK
- Pillow (PIL)
- NumPy

## Installation

1. Install the required Python packages:

```bash
pip install fastapi uvicorn pydantic python-multipart easyocr fpdf google-generativeai neo4j pillow numpy
```

2. Make sure Neo4j is running on your system or use a cloud instance.

3. Update the configuration variables in `main.py`:
   - Neo4j credentials
   - Google Gemini API key

## Running the Server

```bash
cd src/backend
python main.py
```

The server will run at http://localhost:8000

## API Documentation

Once the server is running, you can access the API documentation at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## API Endpoints

- `POST /extract-text` - Extract text from uploaded image
- `POST /classify` - Classify incident description into crime type
- `POST /report` - Submit a new incident report
- `GET /reports` - Get all reports
- `GET /reports/{report_id}` - Get a specific report
- `GET /reports/{report_id}/pdf` - Download report as PDF
- `POST /reports/{report_id}/blockchain` - Store a report in blockchain
- `GET /blockchain` - Get all blockchain data
