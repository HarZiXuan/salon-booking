import hashlib
import time
import requests
import json

BASE_URL = "http://54.169.239.246:8888/api/v1"
SHOP_SLUG = "service"
PRODUCT_KEY = "MSIM5PUBCLZ4H5CR"
SECRET_KEY = "tszZF0ejCLMb4Pq0TEO2kduUIOoTVDY9"

def fetch_api(endpoint, method='GET', data=None, token=None):
    timestamp = str(int(time.time()))
    
    signature_body = ""
    if data:
        sorted_keys = sorted(data.keys())
        sorted_params = {k: data[k] for k in sorted_keys}
        signature_body = json.dumps(sorted_params, separators=(',', ':'))
    
    sign_string = PRODUCT_KEY + SECRET_KEY + timestamp + signature_body
    signature = hashlib.md5(sign_string.encode('utf-8')).hexdigest()

    headers = {
        'Accept': 'application/json',
        'X-Product-Key': PRODUCT_KEY,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
    }
    
    if token:
        headers['Authorization'] = f"Bearer {token}"
    
    url = f"{BASE_URL}/shops/{SHOP_SLUG}{endpoint}"
    
    try:
        if method == 'POST':
            response = requests.post(url, headers=headers, json=data)
        else:
            response = requests.get(url, headers=headers)
        
        print(f"[{method}] {url} - Status: {response.status_code}")
        return response.json()
    except Exception as e:
        print(f"Fetch error: {e}")
        return None

if __name__ == "__main__":
    print("Logging in...")
    login_data = {
        "contact": "+601877849118",
        "password": "123456789"
    }
    login_res = fetch_api("/customers/login", method='POST', data=login_data)
    
    if login_res and login_res.get('success'):
        token = login_res['data']['token']
        print("Login successful!")
        
        print("\nFetching rewards for 'service' (kapas)...")
        rewards = fetch_api("/rewards", token=token)
        print(json.dumps(rewards, indent=2))
    else:
        print("Login failed.")
        print(json.dumps(login_res, indent=2))
