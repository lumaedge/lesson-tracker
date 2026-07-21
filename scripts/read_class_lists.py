import msoffcrypto, io, xlrd, os, glob

folder = r"C:\Users\Administrator.EJS\Desktop\Lesson Tracker\lesson-tracker\class lists"
files = sorted(glob.glob(os.path.join(folder, "*.xls")))

pw = "Sit@dbe"

for f in files:
    name = os.path.basename(f)
    try:
        decrypted = io.BytesIO()
        with open(f, "rb") as fh:
            office = msoffcrypto.OfficeFile(fh)
            office.load_key(password=pw)
            office.decrypt(decrypted)
        decrypted.seek(0)
        wb = xlrd.open_workbook(file_contents=decrypted.read())
        ws = wb.sheet_by_index(0)
        count = 0
        for r in range(1, ws.nrows):
            surname = str(ws.cell_value(r, 0)).strip()
            if surname and surname != "Surname":
                count += 1
        print(f"{name}: {count} students")
    except Exception as e:
        print(f"{name}: ERROR - {e}")
