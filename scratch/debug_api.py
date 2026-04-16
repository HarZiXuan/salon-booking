
import hashlib
import time
import requests
import json

BASE_URL = "http://54.169.239.246:8888/api/v1"
PRODUCT_KEY = "MSIM5PUBCLZ4H5CR"
SECRET_KEY = "tszZF0ejCLMb4Pq0TEO2kduUIOoTVDY9"

def api_fetch(slug, endpoint, method="GET", data=None):
    timestamp = str(int(time.time()))
    url = f"{BASE_URL}/shops/{slug}{endpoint}"
    
    signature_body = ""
    if data:
        sorted_keys = sorted(data.keys())
        sorted_params = {k: data[k] for k in sorted_keys}
        signature_body = json.dumps(sorted_params, separators=(',', ':'))
        
    sign_string = PRODUCT_KEY + SECRET_KEY + timestamp + signature_body
    signature = hashlib.md5(sign_string.encode()).hexdigest()
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Product-Key": PRODUCT_KEY,
        "X-Timestamp": timestamp,
        "X-Signature": signature,
    }
    
    print(f"Testing {method} {url}")
    if method == "GET":
        res = requests.get(url, headers=headers)
    else:
        res = requests.post(url, headers=headers, json=data)
        
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text[:500]}")
    return res

print("--- Testing Shop Details ---")
api_fetch("service", "")

print("\n--- Testing OTP Registration ---")
api_fetch("service", "/customers/register/send-otp", method="POST", data={"contact": "+60167159323"})
