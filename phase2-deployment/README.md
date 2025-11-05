# PHASE 2 DEPLOYMENT FILES

Folder ini berisi semua file yang diperlukan untuk deploy Phase 2 (UI/UX Web App).

## File List

1. **Styles.html** - CSS styles (baru)
2. **UI.html** - Form input interface (baru)
3. **Summary.html** - Executive summary dengan charts (baru)
4. **Cashflow.html** - Simulasi cashflow 12 bulan (baru)
5. **Code.js** - Main entry point (UPDATE file yang sudah ada)

## Cara Deploy

### Step 1: Copy Files ke `/Users/martaen/gas/`

```bash
# Di terminal MacBook:
cp /path/to/phase2-deployment/Styles.html /Users/martaen/gas/
cp /path/to/phase2-deployment/UI.html /Users/martaen/gas/
cp /path/to/phase2-deployment/Summary.html /Users/martaen/gas/
cp /path/to/phase2-deployment/Cashflow.html /Users/martaen/gas/
cp /path/to/phase2-deployment/Code.js /Users/martaen/gas/
```

**ATAU** drag & drop semua 5 file ke folder `/Users/martaen/gas/`

**PENTING:** File `Code.js` akan REPLACE file `Code.js` yang sudah ada. Ini normal!

### Step 2: Push ke Apps Script

```bash
cd /Users/martaen/gas
clasp push
```

Expected output:
```
Pushed 9 files.
└─ appsscript.json
└─ Calculations.js
└─ Code.js          ← Updated
└─ DataManager.js
└─ Tests.js
└─ Styles.html      ← New
└─ UI.html          ← New
└─ Summary.html     ← New
└─ Cashflow.html    ← New
```

### Step 3: Deploy as Web App

#### Option A: Via Apps Script Editor (RECOMMENDED)

1. Buka Apps Script Editor di browser: https://script.google.com
2. Buka project Anda (ID: `1qg4Hdm2QFerYrQO8MqJnms3Ug72gjbU-j02osNp26eZR6k0Dzay3wl8E`)
3. Klik **Deploy** → **New deployment**
4. Klik icon gear (⚙️) di sebelah "Select type"
5. Pilih **Web app**
6. Konfigurasi:
   - **Description:** Phase 2 - Web App UI
   - **Execute as:** Me (your-email@gmail.com)
   - **Who has access:** Anyone (atau sesuai kebutuhan)
7. Klik **Deploy**
8. Copy **Web app URL** yang diberikan
9. Klik **Done**

#### Option B: Via Clasp Command

```bash
clasp deploy --description "Phase 2 - Web App UI"
```

Then get the deployment URL:
```bash
clasp deployments
```

### Step 4: Test Web App

1. Buka Web app URL di browser
2. Isi form input dengan data Anda
3. Klik "Hitung Analisa"
4. View Executive Summary dengan 4 grafik profesional
5. Klik "Lihat Cashflow 12 Bulan"
6. Test "Simpan ke Drive"

## Features Phase 2

- Professional web interface (no emoji icons)
- Responsive design (desktop, tablet, mobile)
- Form input dengan validation
- Toggle Sewa Tetap vs Per Kg
- Auto-calculate Kapasitas Brondolan (65% dari TBS)
- Executive Summary dengan 4 KPI cards
- 4 interactive charts (Chart.js):
  - Perbandingan Laba/Rugi 4 Skenario
  - Breakdown Pemasukan (Pie Chart)
  - Breakdown Pengeluaran (Pie Chart)
  - Pemasukan vs Pengeluaran (Bar Chart)
- Cashflow 12 bulan dengan:
  - Tabel detail per bulan
  - Trend chart
  - In/Outflow chart
- Save to Google Drive functionality
- Clean navigation between pages

## Troubleshooting

### Error: "Result not found or expired"
**Solusi:** Hasil analisa di-cache 6 jam. Jika expired, kembali ke halaman input dan hitung ulang.

### Error: "Authorization required"
**Solusi:** Saat pertama kali deploy web app, klik "Review permissions" dan authorize aplikasi.

### Charts tidak muncul
**Solusi:** Pastikan koneksi internet aktif. Chart.js di-load dari CDN.

### Web App URL tidak bisa diakses
**Solusi:**
1. Pastikan "Who has access" di-set sesuai kebutuhan
2. Jika "Only myself", hanya Anda yang bisa akses
3. Jika "Anyone", semua orang bisa akses (tidak perlu login)

## Support

Jika ada masalah, cek:
1. Execution log di Apps Script Editor
2. Browser console (F12)
3. Run `runAllTests()` di Apps Script untuk validasi backend

---

**Version:** 2.0.0 - Phase 2 UI/UX Implementation
**Date:** November 5, 2025
