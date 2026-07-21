import requests, json, os
from dotenv import load_dotenv
load_dotenv(".env.local")

KV_URL = os.environ["KV_REST_API_URL"]
KV_TOKEN = os.environ["KV_REST_API_TOKEN"]
headers = {"Authorization": f"Bearer {KV_TOKEN}"}

r = requests.get(f"{KV_URL}/get/lesson-tracker:term", headers=headers)
raw = r.json()["result"]
data = json.loads(raw) if isinstance(raw, str) else raw

# Fix: unwrap if wrapped in 'value'
if "value" in data and "classes" in data["value"]:
    data = data["value"]

r = requests.put(f"{KV_URL}/set/lesson-tracker:term", headers=headers, json=data)
print(f"Saved: {r.json()}")

# Verify
r = requests.get(f"{KV_URL}/get/lesson-tracker:term", headers=headers)
raw2 = r.json()["result"]
data2 = json.loads(raw2) if isinstance(raw2, str) else raw2
if "value" in data2 and "classes" in data2["value"]:
    print("STILL WRAPPED")
else:
    count = len(data2.get("classes", []))
    print(f"OK - {count} classes")
