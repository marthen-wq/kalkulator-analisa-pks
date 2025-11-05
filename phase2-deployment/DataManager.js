/**
 * KALKULATOR ANALISA PABRIK KELAPA SAWIT
 * DATA MANAGER
 *
 * File ini mengelola penyimpanan dan loading data JSON
 * ke/dari Google Drive
 */


/**
 * Get folder untuk menyimpan hasil analisa
 * Jika belum ada, akan dibuat otomatis
 */
function getOrCreateAnalysisFolder() {
  const folderName = "Analisa PKS - Results";

  // Cari folder di root Drive
  const folders = DriveApp.getFoldersByName(folderName);

  if (folders.hasNext()) {
    return folders.next();
  }

  // Jika belum ada, buat folder baru
  return DriveApp.createFolder(folderName);
}


/**
 * Save hasil analisa ke Google Drive sebagai JSON file
 *
 * @param {Object} data - Data hasil analisa lengkap
 * @param {string} filename - Nama file (opsional)
 * @returns {Object} File info (id, name, url)
 */
function saveAnalysisToJSON(data, filename = null) {
  try {
    // Generate filename jika tidak disediakan
    if (!filename) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      filename = `analisa_pks_${timestamp}.json`;
    }

    // Pastikan ekstensi .json
    if (!filename.endsWith('.json')) {
      filename += '.json';
    }

    // Convert data ke JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Get/create folder
    const folder = getOrCreateAnalysisFolder();

    // Create file
    const file = folder.createFile(filename, jsonString, MimeType.PLAIN_TEXT);

    Logger.log(`✓ File saved: ${filename}`);
    Logger.log(`  URL: ${file.getUrl()}`);

    return {
      id: file.getId(),
      name: file.getName(),
      url: file.getUrl(),
      size: file.getSize(),
      created: file.getDateCreated()
    };

  } catch (error) {
    Logger.log(`✗ Error saving file: ${error.message}`);
    throw error;
  }
}


/**
 * Load data analisa dari JSON file di Google Drive
 *
 * @param {string} fileId - ID file di Google Drive
 * @returns {Object} Data analisa
 */
function loadAnalysisFromJSON(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    const content = file.getBlob().getDataAsString();
    const data = JSON.parse(content);

    Logger.log(`✓ File loaded: ${file.getName()}`);
    return data;

  } catch (error) {
    Logger.log(`✗ Error loading file: ${error.message}`);
    throw error;
  }
}


/**
 * List semua file analisa yang tersimpan
 *
 * @returns {Array} Array of file info
 */
function listAnalysisFiles() {
  try {
    const folder = getOrCreateAnalysisFolder();
    const files = folder.getFilesByType(MimeType.PLAIN_TEXT);
    const fileList = [];

    while (files.hasNext()) {
      const file = files.next();
      const name = file.getName();

      // Filter hanya file JSON
      if (name.endsWith('.json')) {
        fileList.push({
          id: file.getId(),
          name: name,
          url: file.getUrl(),
          size: file.getSize(),
          created: file.getDateCreated(),
          modified: file.getLastUpdated()
        });
      }
    }

    // Sort by modified date (newest first)
    fileList.sort((a, b) => b.modified - a.modified);

    Logger.log(`Found ${fileList.length} analysis files`);
    return fileList;

  } catch (error) {
    Logger.log(`✗ Error listing files: ${error.message}`);
    throw error;
  }
}


/**
 * Delete file analisa
 *
 * @param {string} fileId - ID file yang akan dihapus
 * @returns {boolean} Success status
 */
function deleteAnalysisFile(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    const filename = file.getName();

    file.setTrashed(true);

    Logger.log(`✓ File deleted: ${filename}`);
    return true;

  } catch (error) {
    Logger.log(`✗ Error deleting file: ${error.message}`);
    return false;
  }
}


/**
 * Export hasil analisa ke Google Sheets
 *
 * @param {Object} data - Data hasil analisa
 * @param {string} sheetName - Nama sheet (opsional)
 * @returns {Object} Sheet info
 */
function exportToSheet(data, sheetName = null) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Generate sheet name jika tidak disediakan
    if (!sheetName) {
      const timestamp = new Date().toISOString().split('T')[0];
      sheetName = `Analisa_${timestamp}`;
    }

    // Create new sheet atau get existing
    let sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      sheet.clear(); // Clear existing content
    } else {
      sheet = ss.insertSheet(sheetName);
    }

    // Header
    sheet.getRange(1, 1).setValue("ANALISA PABRIK KELAPA SAWIT");
    sheet.getRange(1, 1).setFontWeight("bold").setFontSize(14);

    // Info
    let row = 3;
    sheet.getRange(row++, 1, 1, 2).setValues([["ID:", data.id]]);
    sheet.getRange(row++, 1, 1, 2).setValues([["Nama Analisa:", data.namaAnalisa]]);
    sheet.getRange(row++, 1, 1, 2).setValues([["Tanggal:", data.tanggal]]);
    sheet.getRange(row++, 1, 1, 2).setValues([["Lokasi:", data.lokasi]]);

    // Ringkasan Skenario
    row += 2;
    sheet.getRange(row++, 1).setValue("RINGKASAN SKENARIO").setFontWeight("bold");

    const headerRow = row++;
    sheet.getRange(headerRow, 1, 1, 6).setValues([[
      "Skenario", "Jam/Hari", "TBS (kg)", "Pemasukan (Rp)", "Pengeluaran (Rp)", "Laba/Rugi (Rp)"
    ]]);
    sheet.getRange(headerRow, 1, 1, 6).setFontWeight("bold");

    const scenarios = ['optimis', 'moderat', 'pesimis', 'darurat'];
    scenarios.forEach(s => {
      const d = data.outputData[s];
      sheet.getRange(row++, 1, 1, 6).setValues([[
        s.toUpperCase(),
        d.jamOperasional,
        d.kebutuhanTBS.perBulan.kg,
        d.cashInflow.totalPerBulan,
        d.cashOutflow.totalPerBulan,
        d.labaRugi.perBulan
      ]]);
    });

    // Cashflow 12 Bulan
    row += 2;
    sheet.getRange(row++, 1).setValue("CASHFLOW 12 BULAN").setFontWeight("bold");

    const cashflowHeaderRow = row++;
    sheet.getRange(cashflowHeaderRow, 1, 1, 7).setValues([[
      "Bulan", "Skenario", "Jam", "Hari", "TBS (kg)", "Pemasukan (Rp)", "Laba (Rp)"
    ]]);
    sheet.getRange(cashflowHeaderRow, 1, 1, 7).setFontWeight("bold");

    data.cashflow12Bulan.forEach(month => {
      sheet.getRange(row++, 1, 1, 7).setValues([[
        month.bulan,
        month.skenario,
        month.jamOperasional,
        month.hariKerja,
        month.tbsOlah,
        month.pemasukan,
        month.labaBersih
      ]]);
    });

    // Format numbers
    sheet.getRange(1, 1, row, 7).setNumberFormat('@');

    Logger.log(`✓ Exported to sheet: ${sheetName}`);

    return {
      sheetName: sheetName,
      url: ss.getUrl()
    };

  } catch (error) {
    Logger.log(`✗ Error exporting to sheet: ${error.message}`);
    throw error;
  }
}


/**
 * Demo: Save and Load
 */
function demoSaveLoad() {
  Logger.log("\n=== DEMO: SAVE & LOAD ===\n");

  // 1. Generate sample data
  const inputData = getBaseInputData();
  inputData.namaAnalisa = "Demo Save Load";
  inputData.lokasi = "PT BUNGO LIMBUR";

  const result = calculateAllScenarios(inputData);

  // 2. Save to JSON
  Logger.log("Saving to JSON...");
  const fileInfo = saveAnalysisToJSON(result);
  Logger.log(`File saved with ID: ${fileInfo.id}`);

  // 3. Load from JSON
  Logger.log("\nLoading from JSON...");
  const loadedData = loadAnalysisFromJSON(fileInfo.id);
  Logger.log(`Data loaded: ${loadedData.namaAnalisa}`);

  // 4. List all files
  Logger.log("\nListing all files...");
  const files = listAnalysisFiles();
  files.forEach(f => {
    Logger.log(`  - ${f.name} (${f.created})`);
  });

  // 5. Export to Sheet
  Logger.log("\nExporting to Sheet...");
  const sheetInfo = exportToSheet(loadedData);
  Logger.log(`Exported to: ${sheetInfo.sheetName}`);

  Logger.log("\n=== DEMO COMPLETED ===\n");
}
