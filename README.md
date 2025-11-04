# 📊 Kalkulator Analisa Pabrik Kelapa Sawit

Aplikasi Google Apps Script untuk menganalisa kelayakan operasional pabrik kelapa sawit dengan berbagai skenario operasional.

## 🎯 Fitur Utama

- ✅ **4 Skenario Operasional**: Optimis, Moderat, Pesimis, Darurat
- ✅ **Perhitungan Otomatis**: TBS, CPO, Kernel, Cangkang
- ✅ **Analisa Cashflow**: Pemasukan, Pengeluaran, Laba/Rugi
- ✅ **Simulasi 12 Bulan**: Proyeksi cashflow tahunan dengan pattern musiman
- ✅ **Toggle Sewa**: Pilihan sewa tetap atau per kg
- ✅ **Export/Import**: JSON dan Google Sheets
- ✅ **Test Suite**: Validasi otomatis dengan 6 test cases

## 📋 Spesifikasi Perhitungan

### Skenario Operasional

| Skenario | Jam/Hari | Keterangan |
|----------|----------|------------|
| Optimis  | 20 jam   | Produksi maksimal |
| Moderat  | 15 jam   | Produksi normal |
| Pesimis  | 10 jam   | Produksi minimal |
| Darurat  | 7 jam    | Kondisi darurat |

### Input Parameters

- **Kapasitas**: TBS per jam, Brondolan per jam
- **Operasional**: Hari kerja per bulan/tahun
- **Rendemen**: OER (CPO), KER (Kernel), Cangkang
- **Harga**: CPO, Kernel, Cangkang, TBS
- **Biaya per Kg**: Angkut, Sparepart, Umum, Overhead
- **Biaya Tetap**: Sewa, Gaji Karyawan, Gaji Manajemen

### Output

- Kebutuhan TBS (per hari & per bulan)
- Produksi CPO, Kernel, Cangkang
- Cash Inflow dengan breakdown persentase
- Cash Outflow (tetap, variable, overhead)
- Laba/Rugi (per bulan, per tahun, per kg)
- Status (LABA/RUGI)

## 🚀 Cara Setup

### 1. Buat Google Spreadsheet Baru

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru
3. Beri nama: "Kalkulator Analisa PKS"

### 2. Buka Apps Script Editor

1. Di Google Sheets, klik **Extensions** > **Apps Script**
2. Hapus kode default yang ada

### 3. Upload File

Copy semua file dari folder `src/` ke Apps Script Editor:

1. **Code.gs** - Main entry point
2. **Calculations.gs** - Core calculation functions
3. **DataManager.gs** - JSON data management
4. **Tests.gs** - Test suite

Cara upload:
- Klik **+** di sebelah Files
- Pilih **Script** untuk file .gs
- Copy-paste isi file
- Save (Ctrl+S)

### 4. Update appsscript.json

1. Klik **Project Settings** (⚙️)
2. Centang "Show appsscript.json in editor"
3. Kembali ke Editor
4. Edit `appsscript.json`, replace dengan:

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

### 5. Deploy

1. Klik **Deploy** > **Test deployments**
2. Atau klik **Run** untuk test functions

## 🧪 Testing

### Run All Tests

1. Di Apps Script Editor, pilih function: `runAllTests`
2. Klik **Run**
3. Klik **View** > **Logs** untuk melihat hasil

Expected output:
```
╔═══════════════════════════════════════════════════════════════╗
║  KALKULATOR ANALISA PABRIK KELAPA SAWIT - TEST SUITE         ║
║  Phase 1: Core Calculations Validation                       ║
╚═══════════════════════════════════════════════════════════════╝

=== TEST F.1: OPTIMIS (SEWA TETAP) ===
  TBS per Bulan (Kg): ✓ PASS
  Total Pemasukan: ✓ PASS
  Total Pengeluaran: ✓ PASS
  Laba per Bulan: ✓ PASS
  Status: ✓ PASS

...

✓✓✓ ALL TESTS PASSED ✓✓✓
```

### Run Quick Test

1. Pilih function: `quickTest`
2. Klik **Run**
3. Lihat detailed output di Logs

### Run Demo Calculation

1. Pilih function: `demoCalculation`
2. Klik **Run**
3. Lihat hasil lengkap di Logs

## 📖 Penggunaan

### 1. Via Script Editor (Development)

```javascript
// Setup input data
const inputData = {
  kapasitas: {
    tbsPerJam: 60000,
    brondonlanPerJam: 39000,
    unitKapasitas: "kg"
  },
  operasional: {
    hariKerjaPerBulan: 26,
    hariKerjaPerTahun: 312
  },
  skenario: {
    optimis: 20,
    moderat: 15,
    pesimis: 10,
    darurat: 7
  },
  // ... dst
};

// Calculate semua skenario
const result = calculateAllScenarios(inputData);

// Print hasil
printCalculationResult(result);

// Save to JSON
const fileInfo = saveAnalysisToJSON(result);

// Export to Sheet
const sheetInfo = exportToSheet(result);
```

### 2. Via Google Sheets Menu

Setelah deploy, akan muncul menu custom "📊 Kalkulator PKS" di Google Sheets dengan opsi:

- **🧮 Run Quick Test**: Jalankan quick test
- **✅ Run All Tests**: Jalankan semua test
- **📖 About**: Info aplikasi

## 📊 Test Cases & Validation

### Test Case F.1: Optimis (Sewa Tetap)

**Input:**
- Jam: 20, Hari Kerja: 26
- Kapasitas: 60,000 kg/jam
- OER: 19.5%, KER: 6%, Cangkang: 10%

**Expected Output:**
- TBS: 31,200,000 kg
- Pemasukan: Rp 105,791,400,000
- Pengeluaran: Rp 102,001,800,000
- Laba: Rp 3,789,600,000 ✅ LABA

### Test Case F.2: Moderat (Sewa Tetap)

**Expected Output:**
- TBS: 23,400,000 kg
- Laba: Rp 2,323,200,000 ✅ LABA

### Test Case F.3: Pesimis (Sewa Tetap)

**Expected Output:**
- TBS: 15,600,000 kg
- Laba: Rp 856,800,000 ✅ LABA

### Test Case F.4: Darurat (Sewa Tetap)

**Expected Output:**
- TBS: 10,920,000 kg
- Laba: Rp -23,040,000 ❌ RUGI

### Test Case F.5: Optimis (Sewa Per Kg)

**Expected Output:**
- Sewa: Rp 1,248,000,000 (40 × 31,200,000)
- Laba: Rp 3,841,600,000 ✅ LABA

### Test Case F.6: Cashflow 12 Bulan

**Pattern Musiman:**
- Puncak Panen: Feb, Mar, Jul (Optimis)
- Normal: Jan, Jun, Ags (Moderat)
- Sepi Panen: Sep, Okt, Nov (Pesimis)
- Libur: Apr (Puasa), Mei (Lebaran), Des (Natal)

## 📁 Struktur File

```
kalkulator-analisa-pks/
├── src/
│   ├── Code.gs           # Main entry point & menu
│   ├── Calculations.gs   # Core calculation functions (C.1-C.10)
│   ├── DataManager.gs    # JSON save/load & export
│   └── Tests.gs          # Test suite (F.1-F.6)
├── appsscript.json       # Apps Script config
└── README.md             # Dokumentasi
```

## 🔧 Core Functions

### Calculations.gs

| Function | Deskripsi |
|----------|-----------|
| `calculateTBSRequirement()` | C.1: Kebutuhan TBS |
| `calculateCPOProduction()` | C.2: Produksi CPO |
| `calculateKernelProduction()` | C.3: Produksi Kernel |
| `calculateCangkangProduction()` | C.4: Produksi Cangkang |
| `calculateCashInflow()` | C.5: Pemasukan |
| `calculateFixedCosts()` | C.6: Biaya Tetap |
| `calculateVariableCosts()` | C.7: Biaya Variable |
| `calculateOverheadCosts()` | C.8: Biaya Overhead |
| `calculateTotalOutflow()` | C.9: Total Pengeluaran |
| `calculateProfitLoss()` | C.10: Laba/Rugi |
| `calculateScenario()` | Hitung satu skenario lengkap |
| `calculate12MonthCashflow()` | Hitung cashflow 12 bulan |

### DataManager.gs

| Function | Deskripsi |
|----------|-----------|
| `saveAnalysisToJSON()` | Save hasil ke Google Drive |
| `loadAnalysisFromJSON()` | Load dari Google Drive |
| `listAnalysisFiles()` | List semua file analisa |
| `deleteAnalysisFile()` | Hapus file analisa |
| `exportToSheet()` | Export ke Google Sheets |

### Tests.gs

| Function | Deskripsi |
|----------|-----------|
| `runAllTests()` | Jalankan semua test |
| `quickTest()` | Quick test dengan detail output |
| `testOptimisSewatetap()` | Test F.1 |
| `testModeratSewaTetap()` | Test F.2 |
| `testPesimisSewatetap()` | Test F.3 |
| `testDaruratSewaTetap()` | Test F.4 |
| `testOptimisSewaPerKg()` | Test F.5 |
| `testCashflow12Bulan()` | Test F.6 |

## 🎨 Roadmap (Future Phases)

### Phase 2: UI/UX (Planned)
- [ ] HTML sidebar untuk input
- [ ] Form validation
- [ ] Interactive charts (Chart.js)
- [ ] Real-time calculation preview

### Phase 3: Advanced Features (Planned)
- [ ] Mode Olah Brondolan
- [ ] Comparison mode (compare multiple scenarios)
- [ ] Sensitivity analysis
- [ ] Export PDF report

### Phase 4: Integration (Planned)
- [ ] Email notification
- [ ] Scheduled reports
- [ ] Multi-user support
- [ ] API endpoints

## 📝 Catatan Penting

1. **Threshold Laba/Rugi**: 0 (bukan 1)
2. **Sewa Toggle**: Pilih antara tetap (Rp/bulan) atau per kg (Rp/kg TBS)
3. **Pattern Cashflow**: Default pattern bisa diubah via parameter
4. **Hari Kerja**: Variasi per bulan sesuai libur/perayaan
5. **Precision**: Semua perhitungan menggunakan floating point, test tolerance ±1-100

## 🐛 Troubleshooting

### Error: "ReferenceError: xxx is not defined"

**Solusi**: Pastikan semua file (.gs) sudah di-upload dan save

### Error: "Exception: You do not have permission to call..."

**Solusi**:
1. Klik **Run** di function yang dipilih
2. Authorize aplikasi untuk mengakses Drive

### Test Failed

**Solusi**:
1. Cek Logs untuk detail error
2. Pastikan input data sesuai spesifikasi
3. Periksa precision/tolerance di test

## 📞 Support

Untuk pertanyaan atau issue:
1. Cek dokumentasi di README.md
2. Review test logs untuk debugging
3. Verify input parameters

## 📄 Lisensi

Aplikasi ini dibuat untuk keperluan analisa internal pabrik kelapa sawit.

---

**Version**: 1.0.0 - Phase 1 Complete
**Last Updated**: November 2025
**Status**: ✅ Core Calculations Validated

---

Made with ❤️ using Google Apps Script