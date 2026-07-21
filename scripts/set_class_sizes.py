import requests, json, os

from dotenv import load_dotenv
load_dotenv(".env.local")

KV_URL = os.environ["KV_REST_API_URL"]
KV_TOKEN = os.environ["KV_REST_API_TOKEN"]

headers = {"Authorization": f"Bearer {KV_TOKEN}"}

r = requests.get(f"{KV_URL}/get/lesson-tracker:term", headers=headers)
data = r.json()["result"]
term = json.loads(data) if isinstance(data, str) else data

COUNTS = {
    ("SU", 3): 35,
    ("M", 4): 36,
    ("NX", 4): 36,
    ("VM", 4): 35,
    ("FR", 5): 37,
    ("MA", 5): 35,
    ("ND", 5): 36,
    ("RU", 6): 39,
    ("SIT", 6): 41,
    ("ZU", 6): 40,
    ("DM", 7): 36,
    ("GU", 7): 34,
    ("MA", 7): 34,
}

for cls in term["classes"]:
    key = (cls["classCode"], cls["grade"])
    if key in COUNTS:
        cls["totalStudents"] = COUNTS[key]
        print(f"  {cls['classCode']} (Gr {cls['grade']}): {COUNTS[key]} students")

r = requests.put(f"{KV_URL}/set/lesson-tracker:term", headers=headers, json={"value": term})
print(f"\nSaved: {r.json()}")
