from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from cachetools import cached, TTLCache
from datetime import datetime, timedelta

app = Flask(__name__)
# Allow CORS so the browser can fetch if needed
CORS(app)

# Cache NVD for 5 minutes (300 sec)
nvd_cache = TTLCache(maxsize=1, ttl=300)

# Cache PhishStats for 3 minutes (180 sec)
phish_cache = TTLCache(maxsize=1, ttl=180)

@app.route('/api/cves')
@cached(nvd_cache)
def get_cves():
    try:
        # Get CVEs from the last 7 days
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        start_date = seven_days_ago.strftime("%Y-%m-%dT00:00:00.000")
        
        url = f"https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate={start_date}&resultsPerPage=20"
        
        # NIST requires a User-Agent sometimes to prevent 403s
        headers = {
            "Accept": "application/json",
            "User-Agent": "SOC-Portfolio-App/1.0"
        }
        
        res = requests.get(url, headers=headers, timeout=10)
        
        # If rate limited, return a specific error code
        if res.status_code in [403, 503]:
            return jsonify({"error": "RATE_LIMIT"}), 429
            
        res.raise_for_status()
        return jsonify(res.json())
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/malware')
@cached(phish_cache)
def get_malware():
    try:
        # URLhaus provides a free recent CSV dump of active malware URLs
        url = "https://urlhaus.abuse.ch/downloads/csv_recent/"
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        
        lines = res.text.splitlines()
        payloads = []
        
        # Skip comments and parse CSV manually (URLhaus puts comments with #)
        csv_data = [l for l in lines if not l.startswith('#') and l.strip()]
        
        # We just want the latest 10 rows
        for row in csv_data[:10]:
            parts = row.replace('"', '').split(',')
            if len(parts) >= 6:
                payloads.append({
                    "id": parts[0],
                    "date": parts[1],
                    "url": parts[2],
                    "status": parts[3],
                    "threat": parts[4],
                    "tags": parts[5]
                })
                
        return jsonify(payloads)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/shodan/<ip>')
def lookup_ip(ip):
    try:
        url = f"https://internetdb.shodan.io/{ip}"
        res = requests.get(url, timeout=5)
        res.raise_for_status()
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
