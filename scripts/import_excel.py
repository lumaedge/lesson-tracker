"""Import data from the Excel spreadsheet into Vercel KV via the app's API."""

import json
import sys
import openpyxl
import requests

EXCEL_PATH = r"C:\Users\Administrator.EJS\Downloads\Term3_Coding_Robotics_LessonTracker.xlsx"
API_BASE = "http://localhost:3000"  # Change when deployed


def import_from_excel(excel_path: str = EXCEL_PATH, api_base: str = API_BASE):
    wb = openpyxl.load_workbook(excel_path)
    ws = wb["Lesson Tracker"]

    classes = []
    for row_num in range(5, 18):
        row = [ws.cell(row=row_num, column=c).value for c in range(1, 12)]
        day = row[0] or ""
        period = row[1] or ""
        grade = row[2] or ""
        class_code = row[3] or ""

        lessons = []
        for i in range(4, 9):
            val = row[i] or ""
            if val not in ("Started", "Done", ""):
                val = ""
            lessons.append(val)

        while len(lessons) < 5:
            lessons.append("")

        class_id = f"class-{row_num - 4}"
        classes.append({
            "id": class_id,
            "day": str(day),
            "period": str(period),
            "grade": int(grade) if grade else 0,
            "classCode": str(class_code),
            "lessons": lessons,
            "notes": str(row[10] or ""),
        })

    term_data = {
        "term": "Term 3 2026",
        "classes": classes,
    }

    print(f"Imported {len(classes)} classes from Excel")

    if api_base:
        resp = requests.put(
            f"{api_base}/api/import",
            json=term_data,
            headers={"Content-Type": "application/json"},
        )
        if resp.ok:
            print(f"Successfully uploaded to {api_base}")
        else:
            print(f"Upload failed: {resp.status_code} {resp.text}")
            sys.exit(1)
    else:
        print(json.dumps(term_data, indent=2))


if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else EXCEL_PATH
    base = sys.argv[2] if len(sys.argv) > 2 else API_BASE
    import_from_excel(path, base)
