import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const CsvXlsxUpload = () => {
    const [fileData, setFileData] = useState([]);
    const fileInputRef = useRef(null); // Reference to the hidden file input

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const fileType = file.name.split('.').pop().toLowerCase(); // Get file extension

        if (fileType === 'csv') {
            // Handle CSV files
            Papa.parse(file, {
                complete: (results) => {
                    setFileData(results.data); // Store CSV data in state
                },
                header: true, // Set to false if your CSV doesn't have headers
                skipEmptyLines: true, // Skip empty lines
            });
        } else if (fileType === 'xlsx') {
            // Handle XLSX files
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames[0]; // Get the first sheet
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                setFileData(jsonData); // Store Excel data in state
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Unsupported file type. Please upload a CSV or XLSX file.');
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Programmatically trigger the file input click
    };

    return (
        <div>
            <h1>Upload CSV or XLSX File</h1>
            <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileChange}
                ref={fileInputRef} // Assign ref to the file input
                style={{ display: 'none' }} // Hide the default file input
            />
            <button type="button" onClick={handleButtonClick}>
                Upload File
            </button>
            {fileData.length > 0 && (
                <div>
                    <h2>File Data:</h2>
                    <pre>{JSON.stringify(fileData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default CsvXlsxUpload;
