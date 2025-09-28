import pandas as pd
import numpy as np
import openpyxl
import fitz
import csv
import json
from typing import Dict, Any, Optional
from pathlib import Path

class FileProcessor:
    def __init__(self):
        self.supported_formats = {
            '.xlsx': self._process_excel,
            '.xls': self._process_excel,
            '.csv': self._process_csv,
            '.pdf': self._process_pdf,
            '.json': self._process_json
        }
    
    def process_file(self, file_path: str, file_type: str = None) -> Optional[Dict[str, Any]]:
        """
        Dosyayı işler ve yapılandırılmış veri döner
        """
        try:
            path = Path(file_path)
            if not path.exists():
                raise FileNotFoundError(f"File not found: {file_path}")
            
            extension = path.suffix.lower()
            
            if extension not in self.supported_formats:
                raise ValueError(f"Unsupported file format: {extension}")
            
            processor = self.supported_formats[extension]
            return processor(file_path)
            
        except Exception as e:
            print(f"Error processing file: {e}")
            return None
    
    def _process_excel(self, file_path: str) -> Dict[str, Any]:
        """Excel dosyasını işle"""
        try:
            # Tüm sheet'leri oku
            excel_file = pd.ExcelFile(file_path)
            data = {}
            
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                data[sheet_name] = {
                    'data': df.to_dict('records'),
                    'columns': df.columns.tolist(),
                    'shape': df.shape,
                    'summary': self._get_dataframe_summary(df)
                }
            
            return {
                'file_type': 'excel',
                'sheets': data,
                'total_sheets': len(data)
            }
            
        except Exception as e:
            raise Exception(f"Excel processing error: {e}")
    
    def _process_csv(self, file_path: str) -> Dict[str, Any]:
        """CSV dosyasını işle"""
        try:
            df = pd.read_csv(file_path)
            
            return {
                'file_type': 'csv',
                'data': df.to_dict('records'),
                'columns': df.columns.tolist(),
                'shape': df.shape,
                'summary': self._get_dataframe_summary(df)
            }
            
        except Exception as e:
            raise Exception(f"CSV processing error: {e}")
    
    def _process_pdf(self, file_path: str) -> Dict[str, Any]:
        """PDF dosyasını işle"""
        try:
            doc = fitz.open(file_path)
            text_content = ""
            tables = []
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text_content += page.get_text()
                
                # Tablolar varsa çıkar
                page_tables = page.find_tables()
                for table in page_tables:
                    table_data = table.extract()
                    tables.append({
                        'page': page_num + 1,
                        'data': table_data
                    })
            
            doc.close()
            
            return {
                'file_type': 'pdf',
                'text_content': text_content,
                'tables': tables,
                'page_count': len(doc)
            }
            
        except Exception as e:
            raise Exception(f"PDF processing error: {e}")
    
    def _process_json(self, file_path: str) -> Dict[str, Any]:
        """JSON dosyasını işle"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
            
            return {
                'file_type': 'json',
                'data': data
            }
            
        except Exception as e:
            raise Exception(f"JSON processing error: {e}")
    
    def _get_dataframe_summary(self, df: pd.DataFrame) -> Dict[str, Any]:
        """DataFrame özet istatistikleri"""
        try:
            numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
            
            summary = {
                'row_count': len(df),
                'column_count': len(df.columns),
                'numeric_columns': numeric_columns,
                'null_counts': df.isnull().sum().to_dict(),
                'data_types': df.dtypes.astype(str).to_dict()
            }
            
            if numeric_columns:
                summary['statistics'] = df[numeric_columns].describe().to_dict()
            
            return summary
            
        except Exception as e:
            return {'error': str(e)}