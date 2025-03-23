
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
from typing import Optional
import json
import os
import datetime
import logging
from pydantic import BaseModel

# Import your existing code - adjust imports if needed
from PIL import Image
import easyocr
import numpy as np
from fpdf import FPDF
import google.generativeai as genai
from neo4j import GraphDatabase
import hashlib
import datetime
import json
import logging

# Configure logging
logging.basicConfig(filename="app.log", level=logging.INFO)

# Configure Google Gemini AI API Key
API_KEY = "AIzaSyCu5clceXxwWZf6-mi0xkDEXUNmlAkNW8s"
genai.configure(api_key=API_KEY)

# Neo4j Database Connection
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# Initialize EasyOCR Reader
reader = easyocr.Reader(['en'])

# Simple Blockchain Implementation
class Block:
    def __init__(self, index, previous_hash, timestamp, data, hash):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.data = data
        self.hash = hash

def calculate_hash(index, previous_hash, timestamp, data):
    value = str(index) + str(previous_hash) + str(timestamp) + str(data)
    return hashlib.sha256(value.encode('utf-8')).hexdigest()

def create_genesis_block():
    return Block(0, "0", datetime.datetime.now(), "Genesis Block", calculate_hash(0, "0", datetime.datetime.now(), "Genesis Block"))

def create_new_block(previous_block, data):
    index = previous_block.index + 1
    timestamp = datetime.datetime.now()
    hash = calculate_hash(index, previous_block.hash, timestamp, data)
    return Block(index, previous_block.hash, timestamp, data, hash)

# Load blockchain from a JSON file
def load_blockchain():
    try:
        with open("blockchain.json", "r") as f:
            # Check if the file is empty
            content = f.read()
            if not content.strip():
                # If the file is empty, initialize with the genesis block
                return [create_genesis_block()]
            
            # Load JSON data
            blockchain_data = json.loads(content)
            blockchain = []
            for block_data in blockchain_data:
                block = Block(
                    index=block_data["index"],
                    previous_hash=block_data["previous_hash"],
                    timestamp=datetime.datetime.strptime(block_data["timestamp"], "%Y-%m-%d %H:%M:%S.%f") if isinstance(block_data["timestamp"], str) else block_data["timestamp"],
                    data=block_data["data"],
                    hash=block_data["hash"]
                )
                blockchain.append(block)
            return blockchain
    except FileNotFoundError:
        # If the file doesn't exist, start with the genesis block
        return [create_genesis_block()]
    except json.JSONDecodeError:
        # If the file contains invalid JSON, start with the genesis block
        logging.error("Invalid JSON in blockchain.json. Initializing with a new blockchain.")
        return [create_genesis_block()]

# Save blockchain to a JSON file
def save_blockchain(blockchain):
    try:
        # Convert blockchain data to a JSON-serializable format
        blockchain_data = []
        for block in blockchain:
            block_data = {
                "index": block.index,
                "previous_hash": block.previous_hash,
                "timestamp": str(block.timestamp),  # Convert timestamp to string
                "data": block.data,
                "hash": block.hash
            }
            # Convert datetime.date objects in 'data' to strings
            if isinstance(block.data, dict):
                for key, value in block.data.items():
                    if isinstance(value, (datetime.date, datetime.datetime)):
                        block.data[key] = str(value)  # Convert date to string
            blockchain_data.append(block_data)

        # Write to the JSON file
        with open("blockchain.json", "w") as f:
            json.dump(blockchain_data, f, indent=4)
        return True
    except Exception as e:
        logging.error(f"Error saving blockchain: {e}")
        return False

# Validate report data
def validate_report(report):
    required_fields = ["name", "mobile", "place", "incident_date", "reporting_date", "description", "crime_type"]
    for field in required_fields:
        if field not in report:
            raise ValueError(f"Missing required field: {field}")
    return True

# Load blockchain data
blockchain = load_blockchain()
previous_block = blockchain[-1] if blockchain else create_genesis_block()

# Function to extract text using EasyOCR
def extract_text_from_image(image_path):
    try:
        img = Image.open(image_path)
        if img.mode != 'L':
            img = img.convert('L')
        img_np = np.array(img)
        results = reader.readtext(img_np)
        extracted_text = "\n".join([res[1] for res in results])
        return extracted_text
    except Exception as e:
        logging.error(f"Error extracting text: {e}")
        return ""

# Function to classify crime using Gemini AI
def classify_crime(text):
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(f"Classify the following incident into one of these cybercrime types: phishing, malware, ransomware, identity theft, hacking, or other. Incident: {text}")
        return response.text.strip()
    except Exception as e:
        logging.error(f"Error in Gemini API: {e}")
        return "Classification failed"

# Store Report in Neo4j
def store_report(name, mobile, place, incident_date, reporting_date, description, crime_type):
    try:
        with driver.session() as session:
            result = session.run(
                """
                MERGE (p:Person {name: $name, mobile: $mobile})
                MERGE (c:Crime {type: $crime_type})
                CREATE (r:Report {id: randomUUID(), place: $place, incident_date: $incident_date, reporting_date: $reporting_date, description: $description})
                CREATE (p)-[:MADE]->(r)
                CREATE (r)-[:CLASSIFIED_AS]->(c)
                RETURN r.id as id
                """,
                name=name, mobile=mobile, place=place, incident_date=incident_date,
                reporting_date=reporting_date, description=description, crime_type=crime_type
            )
            record = result.single()
            return record["id"] if record else None
    except Exception as e:
        logging.error(f"Error storing report: {e}")
        return None

# Generate PDF Report
def generate_pdf(report):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", style="B", size=16)
    pdf.cell(200, 10, "CyberAID Incident Report", ln=True, align='C')
    pdf.ln(10)
    
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, f"Name: {report['name']}", ln=True)
    pdf.cell(200, 10, f"Mobile: {report['mobile']}", ln=True)
    pdf.cell(200, 10, f"Place: {report['place']}", ln=True)
    pdf.cell(200, 10, f"Incident Date: {report['incident_date']}", ln=True)
    pdf.cell(200, 10, f"Reporting Date: {report['reporting_date']}", ln=True)
    pdf.multi_cell(0, 10, f"Description: {report['description']}")
    pdf.cell(200, 10, f"Crime Type: {report['crime_type']}", ln=True)
    if 'extracted_text' in report and report['extracted_text']:
        pdf.multi_cell(0, 10, f"Evidence (Extracted Text): {report['extracted_text']}")
    pdf.ln(10)
    
    pdf_output = f"incident_report_{report['id']}.pdf"
    pdf.output(pdf_output)
    return pdf_output

# Store Report in Blockchain
def store_in_blockchain(report):
    global previous_block
    try:
        # Log the report data
        logging.info(f"Storing report: {report}")

        # Validate the report
        validate_report(report)

        # Create a new block
        new_block = create_new_block(previous_block, report)
        blockchain.append(new_block)
        previous_block = new_block

        # Save the updated blockchain to the JSON file
        return save_blockchain(blockchain)
    except Exception as e:
        logging.error(f"Error storing report in blockchain: {e}")
        return False

# Get all reports from Neo4j
def get_all_reports():
    try:
        with driver.session() as session:
            result = session.run(
                """
                MATCH (p:Person)-[:MADE]->(r:Report)-[:CLASSIFIED_AS]->(c:Crime)
                RETURN r.id AS id, p.name AS name, p.mobile AS mobile, r.place AS place, 
                       r.incident_date AS incident_date, r.reporting_date AS reporting_date,
                       r.description AS description, c.type AS crime_type
                """
            )
            reports = []
            for record in result:
                reports.append({
                    "id": record["id"],
                    "name": record["name"],
                    "mobile": record["mobile"],
                    "place": record["place"],
                    "incident_date": record["incident_date"],
                    "reporting_date": record["reporting_date"],
                    "description": record["description"],
                    "crime_type": record["crime_type"]
                })
            return reports
    except Exception as e:
        logging.error(f"Error getting reports: {e}")
        return []

# Get a specific report from Neo4j
def get_report_by_id(report_id):
    try:
        with driver.session() as session:
            result = session.run(
                """
                MATCH (p:Person)-[:MADE]->(r:Report)-[:CLASSIFIED_AS]->(c:Crime)
                WHERE r.id = $id
                RETURN r.id AS id, p.name AS name, p.mobile AS mobile, r.place AS place, 
                       r.incident_date AS incident_date, r.reporting_date AS reporting_date,
                       r.description AS description, c.type AS crime_type
                """,
                id=report_id
            )
            record = result.single()
            if record:
                return {
                    "id": record["id"],
                    "name": record["name"],
                    "mobile": record["mobile"],
                    "place": record["place"],
                    "incident_date": record["incident_date"],
                    "reporting_date": record["reporting_date"],
                    "description": record["description"],
                    "crime_type": record["crime_type"]
                }
            return None
    except Exception as e:
        logging.error(f"Error getting report by ID: {e}")
        return None

# FastAPI models
class ClassifyRequest(BaseModel):
    description: str

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class ExtractTextResponse(BaseModel):
    extracted_text: str

class ClassificationResponse(BaseModel):
    crime_type: str

# Create FastAPI app
app = FastAPI(title="CyberAID API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to CyberAID API"}

@app.post("/extract-text", response_model=ExtractTextResponse)
async def extract_text(file: UploadFile = File(...)):
    try:
        # Save the uploaded file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as f:
            f.write(await file.read())
        
        # Extract text from the image
        extracted_text = extract_text_from_image(temp_file_path)
        
        # Clean up the temporary file
        os.remove(temp_file_path)
        
        return {"extracted_text": extracted_text}
    except Exception as e:
        logging.error(f"Error in /extract-text: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/classify", response_model=ClassificationResponse)
async def classify(request: ClassifyRequest):
    try:
        crime_type = classify_crime(request.description)
        return {"crime_type": crime_type}
    except Exception as e:
        logging.error(f"Error in /classify: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/report", response_model=ApiResponse)
async def submit_report(
    name: str = Form(...),
    mobile: str = Form(...),
    place: str = Form(...),
    incident_date: str = Form(...),
    reporting_date: str = Form(...),
    description: str = Form(...),
    crime_type: str = Form(...),
    extracted_text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    try:
        # Store the report in Neo4j
        report_id = store_report(name, mobile, place, incident_date, reporting_date, description, crime_type)
        
        if not report_id:
            return JSONResponse(
                status_code=500,
                content={"success": False, "message": "Failed to store report in database"}
            )
        
        # Create report data for blockchain storage
        report_data = {
            "id": report_id,
            "name": name,
            "mobile": mobile,
            "place": place,
            "incident_date": incident_date,
            "reporting_date": reporting_date,
            "description": description,
            "crime_type": crime_type
        }
        
        if extracted_text:
            report_data["extracted_text"] = extracted_text
        
        # Store the report in blockchain
        if store_in_blockchain(report_data):
            return {
                "success": True,
                "message": "Report submitted successfully",
                "data": {"report_id": report_id}
            }
        else:
            return {
                "success": True,
                "message": "Report stored in database but failed to store in blockchain",
                "data": {"report_id": report_id}
            }
    except Exception as e:
        logging.error(f"Error in /report: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        )

@app.get("/reports")
async def get_reports():
    try:
        reports = get_all_reports()
        return reports
    except Exception as e:
        logging.error(f"Error in /reports: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/reports/{report_id}")
async def get_report(report_id: str):
    try:
        report = get_report_by_id(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        return report
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error in /reports/{report_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/reports/{report_id}/pdf")
async def download_report_pdf(report_id: str):
    try:
        report = get_report_by_id(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        pdf_path = generate_pdf(report)
        return FileResponse(pdf_path, filename=f"incident_report_{report['name']}.pdf")
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error in /reports/{report_id}/pdf: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reports/{report_id}/blockchain", response_model=ApiResponse)
async def store_report_in_blockchain(report_id: str):
    try:
        report = get_report_by_id(report_id)
        if not report:
            return JSONResponse(
                status_code=404,
                content={"success": False, "message": "Report not found"}
            )
        
        if store_in_blockchain(report):
            return {
                "success": True,
                "message": "Report stored in blockchain successfully"
            }
        else:
            return JSONResponse(
                status_code=500,
                content={"success": False, "message": "Failed to store report in blockchain"}
            )
    except Exception as e:
        logging.error(f"Error in /reports/{report_id}/blockchain: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        )

@app.get("/blockchain")
async def get_blockchain():
    try:
        # Convert blockchain to a JSON-serializable format
        blocks = []
        for block in blockchain:
            blocks.append({
                "index": block.index,
                "timestamp": str(block.timestamp),
                "previous_hash": block.previous_hash,
                "data": block.data,
                "hash": block.hash
            })
        return blocks
    except Exception as e:
        logging.error(f"Error in /blockchain: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the server
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
