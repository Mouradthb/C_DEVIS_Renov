from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
import pandas as pd
from typing import List
import io
from pydantic import BaseModel
import pdfkit
from .utils import extract_pdf_data, compare_data, generate_pdf_report

app = FastAPI()

class FileUploadResponse(BaseModel):
    status: str
    data: dict

@app.post("/upload/")
async def upload_files(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    try:
        # Read PDFs into memory
        pdf1_content = await file1.read()
        pdf2_content = await file2.read()

        # Extract data from PDFs
        data_pdf1 = extract_pdf_data(pdf1_content)
        data_pdf2 = extract_pdf_data(pdf2_content)

        # Compare the data
        comparison_results = compare_data(data_pdf1, data_pdf2)

        # Generate PDF report from comparison results
        pdf_report = generate_pdf_report(comparison_results)

        # Return a structured JSON response
        return FileUploadResponse(status="success", data=comparison_results)

    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})