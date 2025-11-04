# 🚀 Deployment Guide - Kalkulator Analisa PKS

Panduan lengkap untuk deploy aplikasi Kalkulator Analisa Pabrik Kelapa Sawit ke Google Apps Script.

## 📋 Prerequisites

- ✅ Akun Google (Gmail)
- ✅ Akses ke Google Sheets
- ✅ Akses ke Google Apps Script
- ✅ Browser modern (Chrome, Firefox, Edge)

## 🔧 Step-by-Step Deployment

### Step 1: Buat Google Spreadsheet Baru

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **Blank** untuk membuat spreadsheet baru
3. Rename spreadsheet: **"Kalkulator Analisa PKS"**

![Create Sheet](https://via.placeholder.com/600x150/4285f4/ffffff?text=Step+1:+Create+New+Sheet)

---

### Step 2: Buka Apps Script Editor

1. Di menu Google Sheets, klik **Extensions** > **Apps Script**
2. Akan terbuka tab baru dengan Apps Script Editor
3. Hapus kode default (`function myFunction() { ... }`)

![Open Apps Script](https://via.placeholder.com/600x150/34a853/ffffff?text=Step+2:+Open+Apps+Script+Editor)

---

### Step 3: Setup Project Files

#### 3.1 Configure appsscript.json

1. Klik **Project Settings** (⚙️ icon di sidebar kiri)
2. Centang **"Show appsscript.json in editor"**
3. Kembali ke **Editor** tab
4. Klik pada file **appsscript.json**
5. Replace seluruh isi dengan:

```json
{
  "timeZone": "Asia/Jakarta",
  "dependencies": {
    "enabledAdvancedServices": []
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```

6. Save (Ctrl+S atau Cmd+S)

---

#### 3.2 Rename Code.gs menjadi Calculations.gs

1. Klik **Code.gs** (file default)
2. Klik **⋮** (three dots) di samping nama file
3. Pilih **Rename**
4. Ganti nama menjadi: **Calculations.gs**

---

#### 3.3 Copy Calculations.gs Content

1. Buka file `/src/Calculations.gs` dari repository
2. Copy SELURUH isi file (Ctrl+A, Ctrl+C)
3. Kembali ke Apps Script Editor
4. Paste ke **Calculations.gs** (Ctrl+V)
5. Save (Ctrl+S)

✅ File Calculations.gs selesai

---

#### 3.4 Create Code.gs

1. Klik **+** (plus icon) di samping **Files**
2. Pilih **Script**
3. Nama file: **Code**
4. Buka file `/src/Code.gs` dari repository
5. Copy seluruh isi
6. Paste ke file **Code.gs** di Apps Script Editor
7. Save (Ctrl+S)

✅ File Code.gs selesai

---

#### 3.5 Create DataManager.gs

1. Klik **+** di samping **Files**
2. Pilih **Script**
3. Nama file: **DataManager**
4. Buka file `/src/DataManager.gs` dari repository
5. Copy seluruh isi
6. Paste ke file **DataManager.gs** di Apps Script Editor
7. Save (Ctrl+S)

✅ File DataManager.gs selesai

---

#### 3.6 Create Tests.gs

1. Klik **+** di samping **Files**
2. Pilih **Script**
3. Nama file: **Tests**
4. Buka file `/src/Tests.gs` dari repository
5. Copy seluruh isi
6. Paste ke file **Tests.gs** di Apps Script Editor
7. Save (Ctrl+S)

✅ File Tests.gs selesai

---

### Step 4: Verify File Structure

Pastikan struktur file Anda seperti ini:

```
Kalkulator Analisa PKS (Project)
├── appsscript.json
├── Code.gs
├── Calculations.gs
├── DataManager.gs
└── Tests.gs
```

![File Structure](https://via.placeholder.com/600x150/fbbc04/ffffff?text=Step+4:+Verify+File+Structure)

---

### Step 5: First Run - Authorization

1. Di Apps Script Editor, pilih function **runAllTests** dari dropdown
2. Klik **Run** (▶️ icon)
3. Akan muncul dialog **"Authorization required"**
4. Klik **Review Permissions**
5. Pilih akun Google Anda
6. Klik **Advanced** (atau "Lanjutan")
7. Klik **"Go to Kalkulator Analisa PKS (unsafe)"**
8. Review permissions dan klik **Allow**

**Permissions yang diminta:**
- ✅ View and manage spreadsheets
- ✅ View and manage files in Google Drive
- ✅ Display and run web content

![Authorization](https://via.placeholder.com/600x150/ea4335/ffffff?text=Step+5:+Authorize+App)

---

### Step 6: Run Tests

1. Setelah authorization selesai, klik **Run** lagi
2. Klik **View** > **Logs** (atau Ctrl+Enter)
3. Lihat output test di Logs panel

**Expected Output:**

```
╔═══════════════════════════════════════════════════════════════╗
║  KALKULATOR ANALISA PABRIK KELAPA SAWIT - TEST SUITE         ║
║  Phase 1: Core Calculations Validation                       ║
╚═══════════════════════════════════════════════════════════════╝

=== TEST F.1: OPTIMIS (SEWA TETAP) ===
  TBS per Bulan (Kg): ✓ PASS
    Expected: 31,200,000
    Actual:   31,200,000
    Diff:     0
  Total Pemasukan: ✓ PASS
    Expected: 105,791,400,000
    Actual:   105,791,400,000
    Diff:     0
  Total Pengeluaran: ✓ PASS
    Expected: 102,001,800,000
    Actual:   102,001,800,000
    Diff:     0
  Laba per Bulan: ✓ PASS
    Expected: 3,789,600,000
    Actual:   3,789,600,000
    Diff:     0
  Status: ✓ PASS (Expected: LABA, Actual: LABA)

Test F.1 Result: ✓ ALL PASSED

... [similar output for F.2 - F.6] ...

╔═══════════════════════════════════════════════════════════════╗
║  TEST SUMMARY                                                 ║
╚═══════════════════════════════════════════════════════════════╝

  F.1 - Optimis (Sewa Tetap):     ✓ PASSED
  F.2 - Moderat (Sewa Tetap):     ✓ PASSED
  F.3 - Pesimis (Sewa Tetap):     ✓ PASSED
  F.4 - Darurat (Sewa Tetap):     ✓ PASSED
  F.5 - Optimis (Sewa Per Kg):    ✓ PASSED
  Cashflow 12 Bulan:              ✓ PASSED

=================================================================
  ✓✓✓ ALL TESTS PASSED ✓✓✓
  Phase 1: Core Calculations - VALIDATED!
=================================================================
```

✅ Jika semua test PASSED, deployment berhasil!

---

### Step 7: Test Menu di Google Sheets

1. Kembali ke tab **Google Sheets**
2. Refresh page (F5 atau Cmd+R)
3. Tunggu beberapa detik
4. Lihat menu bar, akan muncul menu baru: **📊 Kalkulator PKS**
5. Klik menu tersebut
6. Akan muncul submenu:
   - 🧮 Run Quick Test
   - ✅ Run All Tests
   - 📖 About

![Menu in Sheets](https://via.placeholder.com/600x150/34a853/ffffff?text=Step+7:+Menu+in+Google+Sheets)

---

### Step 8: Run Demo Calculation

1. Kembali ke Apps Script Editor
2. Pilih function **demoCalculation** dari dropdown
3. Klik **Run**
4. Klik **View** > **Logs**
5. Lihat hasil perhitungan lengkap

**Sample Output:**

```
======================================================================
HASIL KALKULASI ANALISA PABRIK KELAPA SAWIT
======================================================================

ID: 2025-11-04T12:30:00.000Z
Nama Analisa: Demo Analisa November 2025
Tanggal: 4 November 2025
Lokasi: PT BUNGO LIMBUR

----------------------------------------------------------------------
RINGKASAN SKENARIO
----------------------------------------------------------------------

OPTIMIS:
  Jam Operasional: 20 jam/hari
  TBS Olah: 31,200,000 kg/bulan
  Pemasukan: Rp 105,791,400,000
  Pengeluaran: Rp 102,001,800,000
  Laba/Rugi: Rp 3,789,600,000 (LABA)

MODERAT:
  Jam Operasional: 15 jam/hari
  TBS Olah: 23,400,000 kg/bulan
  Pemasukan: Rp 79,343,550,000
  Pengeluaran: Rp 77,020,350,000
  Laba/Rugi: Rp 2,323,200,000 (LABA)

... [dst]
```

✅ Demo calculation berhasil!

---

### Step 9: Test Save & Load (Optional)

1. Pilih function **demoSaveLoad** dari dropdown
2. Klik **Run**
3. Klik **View** > **Logs**
4. Akan membuat file JSON di Google Drive folder **"Analisa PKS - Results"**

**Expected Output:**

```
=== DEMO: SAVE & LOAD ===

Saving to JSON...
✓ File saved: analisa_pks_2025-11-04T12-30-00-000Z.json
  URL: https://drive.google.com/file/d/xxxxx/view

Loading from JSON...
✓ File loaded: Demo Save Load
Data loaded: Demo Save Load

Listing all files...
Found 1 analysis files
  - analisa_pks_2025-11-04T12-30-00-000Z.json (Mon Nov 04 2025)

Exporting to Sheet...
✓ Exported to sheet: Analisa_2025-11-04

=== DEMO COMPLETED ===
```

5. Cek Google Drive Anda, akan ada folder **"Analisa PKS - Results"**
6. Cek Google Sheets Anda, akan ada sheet baru **"Analisa_2025-11-04"**

✅ Save/Load berfungsi dengan baik!

---

## 🔍 Troubleshooting

### Issue 1: "ReferenceError: formatNumber is not defined"

**Penyebab:** File tidak lengkap atau urutan file salah

**Solusi:**
1. Pastikan SEMUA file sudah di-copy dengan benar
2. Pastikan tidak ada typo di nama file
3. Save semua file (Ctrl+S)
4. Refresh browser
5. Run lagi

---

### Issue 2: "Exception: You do not have permission to call DriveApp..."

**Penyebab:** Belum authorize aplikasi

**Solusi:**
1. Run function apapun
2. Klik **Review Permissions**
3. Allow semua permissions
4. Run lagi

---

### Issue 3: Test Failed - Angka tidak match

**Penyebab:** Mungkin ada perubahan di input data atau precision

**Solusi:**
1. Cek Logs untuk detail error
2. Lihat expected vs actual
3. Jika diff kecil (< 100), kemungkinan rounding error (masih OK)
4. Jika diff besar, cek input data di `getBaseInputData()`

---

### Issue 4: Menu tidak muncul di Google Sheets

**Penyebab:** onOpen() belum dijalankan

**Solusi:**
1. Refresh Google Sheets (F5)
2. Tunggu 5-10 detik
3. Jika masih belum muncul, run function `onOpen()` manually di Apps Script
4. Kembali ke Sheets dan refresh lagi

---

### Issue 5: "Execution timed out"

**Penyebab:** Function terlalu lama (> 6 menit untuk free account)

**Solusi:**
1. Untuk test, tidak akan timeout (< 5 detik)
2. Jika ada loop besar, pertimbangkan optimize code
3. Upgrade ke Google Workspace jika perlu (30 menit limit)

---

## 📊 Post-Deployment Checklist

- [ ] ✅ All files uploaded (Code.gs, Calculations.gs, DataManager.gs, Tests.gs, appsscript.json)
- [ ] ✅ Authorization completed
- [ ] ✅ All tests passed (runAllTests)
- [ ] ✅ Menu muncul di Google Sheets
- [ ] ✅ Demo calculation berhasil
- [ ] ✅ Save/Load berfungsi (optional)
- [ ] ✅ No errors di Logs

---

## 🎯 Next Steps

### Untuk User

1. **Customize Input Data:**
   - Edit function `getBaseInputData()` di Tests.gs
   - Sesuaikan dengan data pabrik Anda

2. **Run Calculations:**
   - Call `calculateAllScenarios(inputData)`
   - Save hasil dengan `saveAnalysisToJSON(result)`
   - Export ke sheet dengan `exportToSheet(result)`

3. **View Results:**
   - Cek folder "Analisa PKS - Results" di Google Drive
   - Cek sheet baru di Google Sheets

### Untuk Developer (Phase 2)

1. **Build UI:**
   - Create HTML sidebar (`UI.html`)
   - Add form untuk input data
   - Add charts untuk visualisasi

2. **Advanced Features:**
   - Mode Olah Brondolan
   - Sensitivity analysis
   - Comparison tools

---

## 📞 Support & Contact

Jika ada masalah saat deployment:

1. **Check Documentation:**
   - README.md
   - VALIDATION_REPORT.md
   - DEPLOYMENT.md (this file)

2. **Debug Steps:**
   - Cek Logs (View > Logs)
   - Cek Executions (View > Executions)
   - Cek file structure

3. **Common Issues:**
   - Review Troubleshooting section di atas
   - Verify all files are saved
   - Ensure authorization is granted

---

## 📄 Additional Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Drive API](https://developers.google.com/drive/api)

---

## ✅ Success Criteria

Deployment dianggap berhasil jika:

1. ✅ Semua 6 test cases PASSED
2. ✅ Menu "Kalkulator PKS" muncul di Google Sheets
3. ✅ Demo calculation berjalan tanpa error
4. ✅ Save/Load JSON berfungsi
5. ✅ Export to Sheet berfungsi

---

**Deployment Version:** 1.0.0
**Last Updated:** November 2025
**Status:** Ready for Production

**Good luck with your deployment! 🚀**

---
