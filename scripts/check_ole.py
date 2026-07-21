import olefile, os

f = r"C:\Users\Administrator.EJS\Desktop\Lesson Tracker\lesson-tracker\class lists\SA-SAMS_eSBA_500139860_20260422_0948_Term2_Gr3_3SUB_CODROB031933.xls"

ole = olefile.OleFileIO(f)
print("Streams:")
for s in ole.listdir():
    print("  ", "/".join(s))
ole.close()
