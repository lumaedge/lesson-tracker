import msoffcrypto, io, xlrd, os, glob

folder = r"C:\Users\Administrator.EJS\Desktop\Lesson Tracker\lesson-tracker\class lists"
f = os.path.join(folder, "SA-SAMS_eSBA_500139860_20260422_0948_Term2_Gr3_3SUB_CODROB031933.xls")

passwords = ["", "password", "Password1", "SA-SAMS", "sasams", "1234", "123456", "admin", "velcro", "SA-SAMS-eSBA"]

for pw in passwords:
    try:
        decrypted = io.BytesIO()
        with open(f, "rb") as fh:
            office = msoffcrypto.OfficeFile(fh)
            office.load_key(password=pw)
            office.decrypt(decrypted)
        decrypted.seek(0)
        print(f'SUCCESS with password: "{pw}"')
        break
    except Exception as e:
        print(f'Failed: "{pw}"')
