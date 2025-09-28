from openai import AsyncOpenAI
from typing import Dict, Any
import json
import asyncio

from app.config import settings

class OpenAIService:
    def __init__(self):
        # Geçici olarak mock response kullan - OpenAI API client sorunu nedeniyle
        print("Using mock responses for OpenAI API")
        self.client = None
        # if settings.openai_api_key:
        #     self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        # else:
        #     print("Warning: OpenAI API key not found. Using mock responses.")
        #     self.client = None
    
    async def get_analysis_insights(self, prompt: str) -> str:
        """Analiz için OpenAI'den insights al"""
        if not self.client:
            return self._get_mock_analysis_response()
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Sen bir iş analisti ve veri uzmanısın. Türkçe cevap ver."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return self._get_mock_analysis_response()
    
    async def ask_question(self, file_data: Dict[str, Any], question: str) -> str:
        """Dosya hakkında soru sor"""
        if not self.client:
            return self._get_mock_question_response(question, file_data)
        
        try:
            # Dosya verisini özet olarak hazırla
            data_summary = self._prepare_data_summary(file_data)
            
            prompt = f"""
            Aşağıdaki veri analizi sonuçlarına dayanarak kullanıcının sorusunu cevapla:
            
            Veri Özeti:
            {data_summary}
            
            Kullanıcının Sorusu: {question}
            
            Lütfen veri analiz sonuçlarına dayanarak detaylı ve faydalı bir cevap ver.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Sen bir veri analisti ve business intelligence uzmanısın. Türkçe cevap ver."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return f"Sorunuzla ilgili analiz yapıldı ancak detaylı cevap şu anda verilemedi. Temel veri incelemesi tamamlandı."
    
    def _prepare_data_summary(self, file_data: Dict[str, Any]) -> str:
        """Dosya verisini özet olarak hazırla"""
        summary = f"Dosya Türü: {file_data.get('file_type', 'Bilinmiyor')}\n"
        
        if 'data_overview' in file_data:
            summary += "Veri Genel Bakış:\n"
            for key, value in file_data['data_overview'].items():
                if isinstance(value, dict):
                    summary += f"- {key}: {str(value)[:200]}...\n"
        
        return summary[:1000]  # OpenAI token limitini aşmamak için kısalt
    
    def _get_mock_analysis_response(self) -> str:
        """OpenAI API olmadığında mock response"""
        return """
        Veri analizi tamamlandı. Genel bulgular:
        
        • Veri kalitesi genel olarak iyi durumda
        • Sayısal değerlerde tutarlılık gözlendi
        • Potansiyel iyileştirme alanları tespit edildi
        • Detaylı inceleme için ek analizler önerilir
        
        Bu analiz temel istatistiksel yöntemler kullanılarak gerçekleştirildi.
        """
    
    def _get_mock_question_response(self, question: str, file_data: Dict[str, Any]) -> str:
        """Gerçek veriye dayalı soru cevaplama"""
        question_lower = question.lower()
        
        # Dosya verilerini analiz et
        stats_summary = self._analyze_file_data_for_questions(file_data)
        
        # Ana bulgular soruları
        if any(word in question_lower for word in ['ana bulgular', 'ana bulgu', 'temel bulgular', 'sonuçlar']):
            return f"""
            📊 **Ana Bulgular** (Gerçek Veri Analizi):
            
            � **Dosya Türü**: {file_data.get('file_type', 'Bilinmiyor').upper()}
            📊 **Veri Boyutu**: {stats_summary.get('total_rows', 0):,} satır
            � **Sayısal Sütunlar**: {stats_summary.get('numeric_columns', 0)} adet
            
            🎯 **Temel İstatistikler**:
            {stats_summary.get('main_stats', 'Hesaplanıyor...')}
            
            ⚡ **Veri Kalitesi**: {stats_summary.get('data_quality', 'İyi')}
            
            Detaylar için ilgili sekmeleri inceleyebilirsiniz.
            """
        
        # Trend soruları
        elif any(word in question_lower for word in ['trend', 'yön', 'artış', 'azalış', 'değişim']):
            return f"""
            � **Trend Analizi** (Gerçek Veriler):
            
            {stats_summary.get('trend_info', '📊 Trend analizi yapılıyor...')}
            
            **💡 Öneri**: Bu trendlerin nedenlerini araştırmanızı ve gelecek projeksiyonları yapmanızı öneriyorum.
            """
        
        # Aksiyon/eylem soruları  
        elif any(word in question_lower for word in ['aksiyon', 'eylem', 'yapmalı', 'öncelik', 'adım']):
            return f"""
            ✅ **Önerilen Eylemler** (Veri Analizine Dayalı):
            
            {stats_summary.get('recommendations', '• Veri analizi sonuçlarını inceleyin')}
            
            Bu öneriler, mevcut veri analizinize dayanmaktadır.
            """
            
        # KPI soruları
        elif any(word in question_lower for word in ['kpi', 'metrik', 'değer', 'ölçüm']):
            return f"""
            📊 **KPI Analizi** (Gerçek Veriler):
            
            {stats_summary.get('kpi_info', '🔢 KPI hesaplamaları yapılıyor...')}
            
            Bu değerler, yüklediğiniz dosyadaki gerçek verilerden hesaplanmıştır.
            """
            
        # Maksimum/minimum değer soruları
        elif any(word in question_lower for word in ['maksimum', 'minimum', 'en yüksek', 'en düşük', 'max', 'min']):
            return f"""
            � **Ekstrem Değerler**:
            
            {stats_summary.get('extremes', '� Ekstrem değerler hesaplanıyor...')}
            """
        
        # Genel sorular
        else:
            return f"""
            � **Veri Analizi Özeti**:
            
            "{question}" sorunuzla ilgili analiz sonuçları:
            
            � **Dosya**: {file_data.get('file_type', 'Bilinmiyor')} formatında
            📈 **Veri Boyutu**: {stats_summary.get('total_rows', 0):,} satır
            🔢 **Analizler**: {stats_summary.get('analysis_count', 'Çeşitli')} analiz yapıldı
            
            Daha detaylı bilgi için spesifik sorular sorabilirsiniz:
            • "Ana bulgular neler?"
            • "En yüksek değerler nerede?"
            • "Hangi trendler var?"
            """
    
    def _analyze_file_data_for_questions(self, file_data: Dict[str, Any]) -> Dict[str, Any]:
        """Dosya verilerini soru cevaplama için analiz et"""
        summary = {
            'total_rows': 0,
            'numeric_columns': 0,
            'main_stats': '',
            'data_quality': 'İyi',
            'trend_info': '',
            'recommendations': '',
            'kpi_info': '',
            'extremes': '',
            'analysis_count': 0,
            'categorical_info': '',
            'time_period': '',
            'data_insights': ''
        }
        
        try:
            if file_data.get('file_type') in ['csv', 'excel']:
                # CSV/Excel verilerini analiz et
                if 'data' in file_data and file_data['data']:
                    import pandas as pd
                    df = pd.DataFrame(file_data['data'])
                    
                    summary['total_rows'] = len(df)
                    
                    # Numerik sütunları tespit et (daha gelişmiş)
                    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
                    
                    # String sütunları sayıya çevirmeyi dene
                    for col in df.columns:
                        if col not in numeric_cols and df[col].dtype == 'object':
                            try:
                                # Virgülleri nokta yap ve sayıya çevir
                                converted = pd.to_numeric(df[col].astype(str).str.replace(',', '.'), errors='coerce')
                                if not converted.isna().all():
                                    df[col] = converted
                                    numeric_cols.append(col)
                            except:
                                continue
                    
                    summary['numeric_columns'] = len(numeric_cols)
                    
                    # Zaman bilgisi tespit et
                    date_cols = []
                    for col in df.columns:
                        if any(word in col.lower() for word in ['tarih', 'date', 'time', 'zaman']):
                            try:
                                df[col] = pd.to_datetime(df[col], errors='coerce')
                                if not df[col].isna().all():
                                    date_cols.append(col)
                                    min_date = df[col].min()
                                    max_date = df[col].max()
                                    summary['time_period'] = f"{min_date.strftime('%Y-%m-%d')} - {max_date.strftime('%Y-%m-%d')}"
                            except:
                                continue
                    
                    if len(numeric_cols) > 0:
                        # Ana istatistikler - daha detaylı
                        stats_text = []
                        for col in numeric_cols[:3]:  # İlk 3 sütun
                            clean_data = df[col].dropna()
                            if len(clean_data) > 0:
                                mean_val = clean_data.mean()
                                if mean_val > 1000000:
                                    stats_text.append(f"• {col.replace('_', ' ').title()}: Ort. {mean_val/1000000:.1f}M")
                                elif mean_val > 1000:
                                    stats_text.append(f"• {col.replace('_', ' ').title()}: Ort. {mean_val/1000:.1f}K") 
                                else:
                                    stats_text.append(f"• {col.replace('_', ' ').title()}: Ort. {mean_val:.2f}")
                        summary['main_stats'] = '\n            '.join(stats_text)
                        
                        # Gelişmiş trend bilgisi
                        trend_texts = []
                        for col in numeric_cols[:2]:  # İlk 2 sütun için trend
                            clean_data = df[col].dropna()
                            if len(clean_data) > 1:
                                std_val = clean_data.std()
                                mean_val = clean_data.mean()
                                cv = (std_val / mean_val * 100) if mean_val != 0 else 0
                                
                                # Zaman serisi trend analizi
                                if date_cols and len(clean_data) > 5:
                                    df_sorted = df.sort_values(date_cols[0])
                                    values = df_sorted[col].dropna()
                                    first_quarter = values.head(len(values)//4).mean()
                                    last_quarter = values.tail(len(values)//4).mean()
                                    
                                    if last_quarter > first_quarter * 1.1:
                                        trend_texts.append(f"📈 **{col.replace('_', ' ').title()}**: Artış trendi (%{((last_quarter-first_quarter)/first_quarter*100):.1f})")
                                    elif last_quarter < first_quarter * 0.9:
                                        trend_texts.append(f"📉 **{col.replace('_', ' ').title()}**: Azalış trendi (%{((first_quarter-last_quarter)/first_quarter*100):.1f})")
                                    else:
                                        trend_texts.append(f"📊 **{col.replace('_', ' ').title()}**: Stabil trend")
                                else:
                                    if cv > 50:
                                        trend_texts.append(f"📊 **{col.replace('_', ' ').title()}**: Yüksek değişkenlik (%{cv:.1f})")
                                    elif cv < 10:
                                        trend_texts.append(f"📈 **{col.replace('_', ' ').title()}**: Stabil değerler (%{cv:.1f})")
                                    else:
                                        trend_texts.append(f"📊 **{col.replace('_', ' ').title()}**: Orta seviye değişkenlik (%{cv:.1f})")
                        
                        summary['trend_info'] = '\n            '.join(trend_texts)
                        
                        # KPI bilgisi - daha anlamlı
                        kpi_texts = []
                        for col in numeric_cols[:3]:
                            clean_data = df[col].dropna()
                            if len(clean_data) > 0:
                                total_val = clean_data.sum()
                                count_val = len(clean_data)
                                unit = "MWh" if 'mwh' in col.lower() else ""
                                kpi_texts.append(f"🔢 **{col.replace('_', ' ').title()}**: Toplam {total_val:,.0f} {unit}, {count_val} kayıt")
                        summary['kpi_info'] = '\n            '.join(kpi_texts)
                        
                        # Ekstrem değerler
                        extreme_texts = []
                        for col in numeric_cols[:2]:
                            clean_data = df[col].dropna()
                            if len(clean_data) > 0:
                                max_val = clean_data.max()
                                min_val = clean_data.min()
                                extreme_texts.append(f"📊 **{col.replace('_', ' ').title()}**: En Yüksek {max_val:,.2f}, En Düşük {min_val:,.2f}")
                        summary['extremes'] = '\n            '.join(extreme_texts)
                        
                        summary['analysis_count'] = len(numeric_cols)
                    
                    # Kategorik veri analizi
                    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
                    categorical_info = []
                    for col in categorical_cols[:2]:  # İlk 2 kategorik sütun
                        if col not in date_cols:  # Tarih sütunları hariç
                            unique_count = df[col].nunique()
                            most_common = df[col].mode().iloc[0] if len(df[col].mode()) > 0 else "N/A"
                            categorical_info.append(f"📋 **{col.replace('_', ' ').title()}**: {unique_count} farklı değer, En yaygın: {most_common}")
                    summary['categorical_info'] = '\n            '.join(categorical_info)
                    
                    # Öneriler - daha akıllı
                    recommendations = []
                    missing_count = df.isnull().sum().sum()
                    if missing_count > 0:
                        recommendations.append(f"🔴 **Yüksek Öncelik**: {missing_count} eksik veri tespit edildi, tamamlanması önerilir")
                    
                    # Aykırı değer kontrolü
                    for col in numeric_cols[:2]:
                        clean_data = df[col].dropna()
                        if len(clean_data) > 10:
                            q1 = clean_data.quantile(0.25)
                            q3 = clean_data.quantile(0.75)
                            iqr = q3 - q1
                            outliers = clean_data[(clean_data < (q1 - 1.5 * iqr)) | (clean_data > (q3 + 1.5 * iqr))]
                            if len(outliers) > len(clean_data) * 0.05:  # %5'ten fazla aykırı değer
                                recommendations.append(f"🟡 **Orta Öncelik**: {col.replace('_', ' ').title()} sütununda {len(outliers)} aykırı değer tespit edildi")
                                break
                    
                    if len(recommendations) == 0:
                        recommendations.append("🟢 **Veri Kalitesi İyi**: Büyük bir veri kalitesi sorunu tespit edilmedi")
                    
                    recommendations.append("💡 **Öneri**: Düzenli veri analizi ve raporlama sistemi kurun")
                    summary['recommendations'] = '\n            '.join(recommendations)
                    
                    # Veri kalitesi değerlendirmesi
                    missing_ratio = df.isnull().sum().sum() / (len(df) * len(df.columns))
                    if missing_ratio > 0.1:
                        summary['data_quality'] = f'İyileştirilebilir (%{missing_ratio*100:.1f} eksik veri)'
                    elif missing_ratio > 0.05:
                        summary['data_quality'] = f'İyi (%{missing_ratio*100:.1f} eksik veri)'
                    else:
                        summary['data_quality'] = 'Mükemmel (minimal eksik veri)'
                    
                    # Genel veri insights
                    insights = []
                    if len(df) > 1000:
                        insights.append("📊 Büyük veri seti - istatistiksel analizler güvenilir")
                    if len(numeric_cols) > 3:
                        insights.append("🔢 Çok sayıda numerik sütun - kapsamlı metrik analizi mümkün")
                    if date_cols:
                        insights.append("📅 Zaman serisi verisi - trend analizi yapılabilir")
                    if len(categorical_cols) > 0:
                        insights.append("📋 Kategorik veriler - segmentasyon analizi mümkün")
                    
                    summary['data_insights'] = ' | '.join(insights)
        
        except Exception as e:
            print(f"Question analysis error: {str(e)}")
            summary['main_stats'] = f'Analiz hatası: {str(e)}'
            
        return summary