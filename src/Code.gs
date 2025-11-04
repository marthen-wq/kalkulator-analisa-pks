/**
 * KALKULATOR ANALISA PABRIK KELAPA SAWIT
 * MAIN ENTRY POINT
 *
 * Google Apps Script application untuk analisa kelayakan
 * operasional pabrik kelapa sawit
 *
 * @version 1.0.0
 * @author Claude AI Assistant
 */


/**
 * Dipanggil saat spreadsheet dibuka
 * Membuat menu custom di Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📊 Kalkulator PKS')
    .addItem('🧮 Run Quick Test', 'quickTest')
    .addItem('✅ Run All Tests', 'runAllTests')
    .addSeparator()
    .addItem('📖 About', 'showAbout')
    .addToUi();
}


/**
 * Menampilkan informasi tentang aplikasi
 */
function showAbout() {
  const ui = SpreadsheetApp.getUi();
  const message = `
KALKULATOR ANALISA PABRIK KELAPA SAWIT
Version 1.0.0

Aplikasi ini membantu menganalisa kelayakan operasional
pabrik kelapa sawit dengan 4 skenario berbeda:
- Optimis (20 jam/hari)
- Moderat (15 jam/hari)
- Pesimis (10 jam/hari)
- Darurat (7 jam/hari)

Fitur:
✓ Perhitungan otomatis kebutuhan TBS
✓ Proyeksi produksi CPO, Kernel, Cangkang
✓ Analisa cashflow dan laba/rugi
✓ Simulasi cashflow 12 bulan
✓ Toggle sewa tetap vs per kg

Developed with ❤️ using Google Apps Script
  `;

  ui.alert('About', message, ui.ButtonSet.OK);
}


/**
 * Helper: Generate timestamp untuk ID
 */
function generateTimestamp() {
  return new Date().toISOString();
}


/**
 * Helper: Format tanggal Indonesia
 */
function formatTanggalIndonesia(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  };
  return date.toLocaleDateString('id-ID', options);
}


/**
 * Main: Calculate All Scenarios
 * Menghitung semua skenario dan mengembalikan hasil lengkap
 *
 * @param {Object} inputData - Data input dari user
 * @returns {Object} Output lengkap dengan 4 skenario dan cashflow 12 bulan
 */
function calculateAllScenarios(inputData) {
  const timestamp = generateTimestamp();
  const tanggal = formatTanggalIndonesia(new Date());

  // Hitung 4 skenario
  const optimis = calculateScenario(
    inputData,
    "optimis",
    inputData.skenario.optimis,
    inputData.operasional.hariKerjaPerBulan
  );

  const moderat = calculateScenario(
    inputData,
    "moderat",
    inputData.skenario.moderat,
    inputData.operasional.hariKerjaPerBulan
  );

  const pesimis = calculateScenario(
    inputData,
    "pesimis",
    inputData.skenario.pesimis,
    inputData.operasional.hariKerjaPerBulan
  );

  const darurat = calculateScenario(
    inputData,
    "darurat",
    inputData.skenario.darurat,
    inputData.operasional.hariKerjaPerBulan
  );

  // Hitung cashflow 12 bulan
  const cashflow12Bulan = calculate12MonthCashflow(inputData);

  // Aggregate hasil
  const result = {
    id: timestamp,
    namaAnalisa: inputData.namaAnalisa || `Analisa_${tanggal}`,
    tanggal: tanggal,
    lokasi: inputData.lokasi || "PT BUNGO LIMBUR",
    inputData: inputData,
    outputData: {
      optimis: optimis,
      moderat: moderat,
      pesimis: pesimis,
      darurat: darurat
    },
    cashflow12Bulan: cashflow12Bulan
  };

  return result;
}


/**
 * Helper: Print hasil kalkulasi ke Logger
 */
function printCalculationResult(result) {
  Logger.log("\n" + "=".repeat(70));
  Logger.log("HASIL KALKULASI ANALISA PABRIK KELAPA SAWIT");
  Logger.log("=".repeat(70));

  Logger.log(`\nID: ${result.id}`);
  Logger.log(`Nama Analisa: ${result.namaAnalisa}`);
  Logger.log(`Tanggal: ${result.tanggal}`);
  Logger.log(`Lokasi: ${result.lokasi}`);

  Logger.log("\n" + "-".repeat(70));
  Logger.log("RINGKASAN SKENARIO");
  Logger.log("-".repeat(70));

  const scenarios = ['optimis', 'moderat', 'pesimis', 'darurat'];
  scenarios.forEach(s => {
    const data = result.outputData[s];
    Logger.log(`\n${s.toUpperCase()}:`);
    Logger.log(`  Jam Operasional: ${data.jamOperasional} jam/hari`);
    Logger.log(`  TBS Olah: ${formatNumber(data.kebutuhanTBS.perBulan.kg)} kg/bulan`);
    Logger.log(`  Pemasukan: Rp ${formatNumber(data.cashInflow.totalPerBulan)}`);
    Logger.log(`  Pengeluaran: Rp ${formatNumber(data.cashOutflow.totalPerBulan)}`);
    Logger.log(`  Laba/Rugi: Rp ${formatNumber(data.labaRugi.perBulan)} (${data.labaRugi.status})`);
  });

  Logger.log("\n" + "-".repeat(70));
  Logger.log("CASHFLOW 12 BULAN");
  Logger.log("-".repeat(70));

  let totalTBS = 0;
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let totalLaba = 0;

  result.cashflow12Bulan.forEach(month => {
    totalTBS += month.tbsOlah;
    totalPemasukan += month.pemasukan;
    totalPengeluaran += month.pengeluaran;
    totalLaba += month.labaBersih;

    Logger.log(`\n${month.bulan} (${month.skenario}, ${month.jamOperasional} jam, ${month.hariKerja} hari):`);
    Logger.log(`  TBS: ${formatNumber(month.tbsOlah)} kg`);
    Logger.log(`  Laba: Rp ${formatNumber(month.labaBersih)} (${month.status})`);
  });

  Logger.log("\n" + "-".repeat(70));
  Logger.log("TOTAL TAHUNAN");
  Logger.log("-".repeat(70));
  Logger.log(`Total TBS Olah: ${formatNumber(totalTBS)} kg`);
  Logger.log(`Total Pemasukan: Rp ${formatNumber(totalPemasukan)}`);
  Logger.log(`Total Pengeluaran: Rp ${formatNumber(totalPengeluaran)}`);
  Logger.log(`Total Laba Bersih: Rp ${formatNumber(totalLaba)}`);
  Logger.log("=".repeat(70) + "\n");
}


/**
 * Demo: Run calculation dengan sample data
 */
function demoCalculation() {
  Logger.log("Running demo calculation...");

  const inputData = getBaseInputData();
  inputData.namaAnalisa = "Demo Analisa November 2025";
  inputData.lokasi = "PT BUNGO LIMBUR";

  const result = calculateAllScenarios(inputData);
  printCalculationResult(result);

  Logger.log("Demo calculation completed!");
  return result;
}
