# 🧪 Local Testing Guide

Panduan lengkap untuk melakukan local test sebelum deploy ke Google Apps Script.

## 📋 Daftar Isi

1. [Node.js Testing](#1️⃣-nodejs-testing)
2. [Browser Testing](#2️⃣-browser-testing)
3. [Manual Testing](#3️⃣-manual-testing)

---

## 1️⃣ Node.js Testing

### Prerequisites

- Node.js installed (v12 atau lebih baru)
- Terminal/Command Prompt

### Cara Run

```bash
# Masuk ke folder project
cd kalkulator-analisa-pks

# Run test
node local-test/standalone-test.js
```

### Output yang Diharapkan

```
╔═══════════════════════════════════════════════════════════════╗
║  KALKULATOR ANALISA PABRIK KELAPA SAWIT - LOCAL TEST         ║
║  Phase 1: Core Calculations Validation                       ║
╚═══════════════════════════════════════════════════════════════╝

=== TEST F.1: OPTIMIS (SEWA TETAP) ===
  TBS per Bulan (Kg): ✓ PASS
    Expected: 31.200.000
    Actual:   31.200.000
    Diff:     0
  Total Pemasukan: ✓ PASS
    Expected: 105.791.400.000
    Actual:   105.791.400.000
    Diff:     0
  ... dst
```

### Pilihan Test Mode

Edit file `standalone-test.js` di bagian paling bawah:

```javascript
// Opsi 1: Run semua test
runAllTests();

// Opsi 2: Run quick demo (detailed output)
// quickDemo();
```

**Uncomment** salah satu untuk memilih mode.

---

## 2️⃣ Browser Testing

### Cara Run

1. **Buka file HTML di browser:**

   ```bash
   # Di folder project
   open local-test/browser-test.html

   # Atau double-click file browser-test.html
   ```

2. **Klik tombol untuk test:**

   - **✅ Run All Tests** - Jalankan semua test (F.1, F.2, F.4)
   - **🧮 Quick Demo** - Demo perhitungan Optimis (detail)
   - **Test Optimis** - Test skenario Optimis saja
   - **Test Moderat** - Test skenario Moderat saja
   - **Test Darurat** - Test skenario Darurat saja
   - **🗑️ Clear** - Bersihkan output

### Screenshot

![Browser Test](https://via.placeholder.com/800x400/667eea/ffffff?text=Browser+Test+Interface)

### Fitur

- ✅ Interface visual yang menarik
- ✅ Real-time output
- ✅ Format angka Indonesia (pemisah ribuan)
- ✅ Color coding untuk status
- ✅ Responsive design

---

## 3️⃣ Manual Testing

### Test Individual Function

Buka file `standalone-test.js` dan tambahkan di bagian bawah:

```javascript
// Test individual function
const inputData = getBaseInputData();

// Test C.1: Kebutuhan TBS
const tbs = calculateTBSRequirement(60000, 20, 3080, 26);
console.log("TBS per Bulan:", formatNumber(tbs.perBulan.kg), "kg");

// Test C.2: Produksi CPO
const cpo = calculateCPOProduction(1200000, 0.195, 13850, 26);
console.log("CPO per Bulan:", formatNumber(cpo.perBulan.kg), "kg");

// ... dst
```

Lalu run:

```bash
node local-test/standalone-test.js
```

---

## 📊 Test Cases

### Test F.1: Optimis (Sewa Tetap)

**Input:**
- Jam: 20, Hari Kerja: 26
- Kapasitas: 60,000 kg/jam
- OER: 19.5%, KER: 6%, Cangkang: 10%

**Expected:**
- TBS: 31,200,000 kg
- Pemasukan: Rp 105,791,400,000
- Pengeluaran: Rp 102,001,800,000
- Laba: Rp 3,789,600,000 ✅ LABA

### Test F.2: Moderat (Sewa Tetap)

**Expected:**
- TBS: 23,400,000 kg
- Laba: Rp 2,323,200,000 ✅ LABA

### Test F.4: Darurat (Sewa Tetap)

**Expected:**
- TBS: 10,920,000 kg
- Laba: Rp -23,040,000 ❌ RUGI

---

## 🔧 Troubleshooting

### Error: "node: command not found"

**Solusi:**
1. Install Node.js dari [nodejs.org](https://nodejs.org)
2. Restart terminal
3. Verify: `node --version`

### Error: Browser tidak bisa buka file HTML

**Solusi:**
1. Right-click file `browser-test.html`
2. Pilih "Open with" > Browser pilihan Anda
3. Atau drag & drop file ke browser

### Test Failed / Angka tidak match

**Solusi:**
1. Cek input data di `getBaseInputData()`
2. Pastikan tidak ada typo
3. Verify formula di function calculation
4. Check precision/tolerance (default ±1 untuk kg, ±100 untuk Rp)

---

## 📝 Modify Input Data

Edit function `getBaseInputData()` untuk test dengan data Anda sendiri:

```javascript
function getBaseInputData() {
  return {
    kapasitas: {
      tbsPerJam: 60000,  // ← Ubah sesuai kapasitas pabrik Anda
      brondonlanPerJam: 39000,
      unitKapasitas: "kg"
    },
    // ... dst
    hargaJual: {
      cpo: 13850,  // ← Ubah sesuai harga pasar
      kernel: 10000,
      cangkang: 900,
      unit: "Rp/kg"
    },
    // ... dst
  };
}
```

---

## ✅ Checklist Before Deploy

Sebelum deploy ke Google Apps Script, pastikan:

- [ ] ✅ All Node.js tests PASSED
- [ ] ✅ Browser tests berjalan dengan baik
- [ ] ✅ Tidak ada error di console
- [ ] ✅ Output sesuai expected values
- [ ] ✅ Input data sudah disesuaikan (jika perlu)
- [ ] ✅ Semua skenario (Optimis, Moderat, Pesimis, Darurat) sudah di-test

---

## 🎯 Next Steps

Setelah local test berhasil:

1. **Deploy ke Google Apps Script**
   - Ikuti panduan di `../DEPLOYMENT.md`
   - Upload semua file dari `../src/`

2. **Run test di Apps Script**
   - Run function `runAllTests()`
   - Verify hasil di Logs

3. **Test di Google Sheets**
   - Buka menu "Kalkulator PKS"
   - Test semua fitur

---

## 📞 Support

Jika ada masalah:

1. Cek dokumentasi di root folder:
   - `README.md`
   - `DEPLOYMENT.md`
   - `VALIDATION_REPORT.md`

2. Review error di console/terminal

3. Verify input data dan formula

---

## 🏆 Success Criteria

Local test dianggap berhasil jika:

1. ✅ Node.js test: ALL PASSED
2. ✅ Browser test: Semua tombol berfungsi
3. ✅ Manual test: Output sesuai expected
4. ✅ No errors di console

---

**Version:** 1.0.0
**Last Updated:** November 2025
**Status:** Ready for Local Testing

**Happy Testing! 🚀**
