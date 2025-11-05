/**
 * KALKULATOR ANALISA PABRIK KELAPA SAWIT
 * MAIN ENTRY POINT
 *
 * Google Apps Script application untuk analisa kelayakan
 * operasional pabrik kelapa sawit
 *
 * @version 2.0.0 - Phase 2: UI/UX Implementation
 * @author Claude AI Assistant
 */


/**
 * ======================
 * WEB APP FUNCTIONS
 * ======================
 */

/**
 * doGet - Web App Entry Point
 * Handles routing for UI, Summary, and Cashflow pages
 */
function doGet(e) {
  const page = e.parameter.page || 'input';
  const resultId = e.parameter.id || '';

  let template;
  if (page === 'summary') {
    template = HtmlService.createTemplateFromFile('Summary');
    template.resultId = resultId;  // Pass ID to template
  } else if (page === 'cashflow') {
    template = HtmlService.createTemplateFromFile('Cashflow');
    template.resultId = resultId;  // Pass ID to template
  } else {
    template = HtmlService.createTemplateFromFile('UI');
  }

  return template.evaluate()
    .setTitle('Kalkulator Analisa PKS')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * include - Include HTML partials (like Styles.html)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * getScriptUrl - Get the web app URL
 */
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

/**
 * processCalculation - Process calculation from UI form
 * @param {Object} inputData - Input data from form
 * @returns {Object} Result with success status and ID
 */
function processCalculation(inputData) {
  try {
    // Calculate all scenarios
    const result = calculateAllScenarios(inputData);
    const resultJson = JSON.stringify(result);
    const dataSize = resultJson.length;

    Logger.log('Result ID: ' + result.id);
    Logger.log('Data size: ' + dataSize + ' bytes (' + (dataSize/1024).toFixed(2) + ' KB)');

    // Store in Cache first (primary storage for web apps)
    const cache = CacheService.getScriptCache();
    cache.put(result.id, resultJson, 21600); // 6 hours
    cache.put('LATEST_RESULT_ID', result.id, 21600);
    Logger.log('Stored in Cache with ID: ' + result.id);

    // Try to store in PropertiesService (might fail if data > 9KB)
    try {
      const props = PropertiesService.getScriptProperties();

      // PropertiesService has 9KB limit per property
      if (dataSize < 9000) {
        props.setProperty(result.id, resultJson);
        props.setProperty('LATEST_RESULT', result.id);
        Logger.log('Stored in PropertiesService');
      } else {
        Logger.log('Data too large for PropertiesService (' + dataSize + ' bytes), using Cache only');
      }
    } catch (e) {
      Logger.log('PropertiesService storage failed: ' + e.toString());
    }

    return {
      success: true,
      id: result.id,
      message: 'Calculation completed successfully'
    };
  } catch (error) {
    Logger.log('Error in processCalculation: ' + error.toString());
    return {
      success: false,
      message: error.toString()
    };
  }
}

/**
 * getCalculationResult - Retrieve calculation result by ID
 * @param {string} id - Result ID or 'LATEST_RESULT' to get latest
 * @returns {Object} Calculation result
 */
function getCalculationResult(id) {
  try {
    Logger.log('getCalculationResult called with id: ' + id);

    // If requesting latest result, get the latest ID first
    if (id === 'LATEST_RESULT') {
      const cache = CacheService.getScriptCache();
      let latestId = cache.get('LATEST_RESULT_ID');

      if (!latestId) {
        const props = PropertiesService.getScriptProperties();
        latestId = props.getProperty('LATEST_RESULT');
      }

      if (!latestId) {
        throw new Error('No recent calculation found. Please perform a calculation first.');
      }

      Logger.log('Latest result ID: ' + latestId);
      id = latestId;
    }

    // Check Cache first (primary storage for web apps)
    const cache = CacheService.getScriptCache();
    const cachedData = cache.get(id);

    if (cachedData) {
      Logger.log('Result found in Cache: ' + id);
      const result = JSON.parse(cachedData);
      Logger.log('Result parsed successfully, has outputData: ' + (!!result.outputData));
      return result;
    }

    // Fallback to PropertiesService
    const props = PropertiesService.getScriptProperties();
    const propData = props.getProperty(id);

    if (propData) {
      Logger.log('Result found in PropertiesService: ' + id);
      const result = JSON.parse(propData);
      Logger.log('Result parsed successfully, has outputData: ' + (!!result.outputData));
      return result;
    }

    throw new Error('Result not found or expired (ID: ' + id + '). Please recalculate.');
  } catch (error) {
    Logger.log('Error in getCalculationResult: ' + error.toString());
    throw error;
  }
}

/**
 * saveResultToDrive - Save calculation result to Google Drive
 * @param {Object} data - Calculation result
 * @returns {Object} Save result with file URL
 */
function saveResultToDrive(data) {
  try {
    const fileName = `${data.namaAnalisa}_${data.id}.json`;
    const fileContent = JSON.stringify(data, null, 2);

    // Get or create folder
    const folder = getOrCreateAnalysisFolder();

    // Create file
    const file = folder.createFile(fileName, fileContent, MimeType.PLAIN_TEXT);

    Logger.log('File saved: ' + fileName);

    return {
      success: true,
      fileId: file.getId(),
      fileName: fileName,
      fileUrl: file.getUrl()
    };
  } catch (error) {
    Logger.log('Error in saveResultToDrive: ' + error.toString());
    throw error;
  }
}


/**
 * ======================
 * SPREADSHEET MENU FUNCTIONS
 * ======================
 */

/**
 * Dipanggil saat spreadsheet dibuka
 * Membuat menu custom di Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Kalkulator PKS')
    .addItem('Run Quick Test', 'quickTest')
    .addItem('Run All Tests', 'runAllTests')
    .addSeparator()
    .addItem('Open Web App', 'openWebApp')
    .addItem('About', 'showAbout')
    .addToUi();
}

/**
 * openWebApp - Open web app in new tab
 */
function openWebApp() {
  const url = getScriptUrl();
  const html = '<script>window.open("' + url + '", "_blank");google.script.host.close();</script>';
  const ui = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModalDialog(ui, 'Opening Web App...');
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
