import xlrd, os, glob

folder = r"C:\Users\Administrator.EJS\Desktop\Lesson Tracker\lesson-tracker\class lists"
files = sorted(glob.glob(os.path.join(folder, "*.xls")))

for f in files:
    name = os.path.basename(f)
    try:
        wb = xlrd.open_workbook(f)
        ws = wb.sheet_by_index(0)
        count = 0
        for r in range(1, ws.nrows):
            surname = str(ws.cell_value(r, 0)).strip()
            if surname and surname != "Surname":
                count += 1
        print(f"{name}: {count} students")
    except Exception as e:
        print(f"{name}: ERROR - {e}")
