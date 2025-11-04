/**
 * KALKULATOR ANALISA PABRIK KELAPA SAWIT
 * TEST SUITE
 *
 * File ini berisi test cases untuk validasi perhitungan
 * sesuai dengan spesifikasi Section F
 */


/**
 * Helper: Format angka dengan pemisah ribuan
 */
function formatNumber(num) {
  return num.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}


/**
 * Helper: Compare dua angka dengan tolerance
 */
function assertAlmostEqual(actual, expected, tolerance = 1, label = "") {
  const diff = Math.abs(actual - expected);
  const passed = diff <= tolerance;

  const status = passed ? "✓ PASS" : "✗ FAIL";
  const prefix = label ? `  ${label}: ` : "  ";

  Logger.log(prefix + status);
  Logger.log(`    Expected: ${formatNumber(expected)}`);
  Logger.log(`    Actual:   ${formatNumber(actual)}`);
  Logger.log(`    Diff:     ${formatNumber(diff)}`);

  return passed;
}


/**
 * Setup Input Data untuk Test Cases
 * Semua test menggunakan data yang sama, kecuali disebutkan berbeda
 */
function getBaseInputData() {
  return {
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
    rendemen: {
      oer: 0.195,
      ker: 0.06,
      cangkang: 0.1
    },
    hargaJual: {
      cpo: 13850,
      kernel: 10000,
      cangkang: 900,
      unit: "Rp/kg"
    },
    hargaBeli: {
      tbs: 3080,
      brondolan: 0,
      unit: "Rp/kg"
    },
    biayaPerKg: {
      ongkosAngkutCPO: 450,
      sparepartChemical: 15,
      biayaUmum: 10,
      overhead: 10,
      unit: "Rp/kg TBS"
    },
    biayaTetap: {
      tipeSewa: "tetap",
      sewaTetap: 1300000000,
      sewaPerKg: 40,
      gajiKaryawan: 480000000,
      gajiManajemen: 296000000,
      unit: "Rp/bulan atau Rp/kg"
    }
  };
}


/**
 * TEST CASE F.1: Optimis (Sewa Tetap)
 */
function testOptimisSewatetap() {
  Logger.log("\n=== TEST F.1: OPTIMIS (SEWA TETAP) ===");

  const inputData = getBaseInputData();
  const result = calculateScenario(inputData, "optimis", 20, 26);

  let allPassed = true;

  // Test: TBS per Bulan (Kg)
  allPassed &= assertAlmostEqual(result.kebutuhanTBS.perBulan.kg, 31200000, 1, "TBS per Bulan (Kg)");

  // Test: Pemasukan
  allPassed &= assertAlmostEqual(result.cashInflow.totalPerBulan, 105791400000, 100, "Total Pemasukan");

  // Test: Pengeluaran
  allPassed &= assertAlmostEqual(result.cashOutflow.totalPerBulan, 102001800000, 100, "Total Pengeluaran");

  // Test: Laba/Rugi
  allPassed &= assertAlmostEqual(result.labaRugi.perBulan, 3789600000, 100, "Laba per Bulan");

  // Test: Status
  const statusPassed = result.labaRugi.status === "LABA";
  Logger.log(`  Status: ${statusPassed ? "✓ PASS" : "✗ FAIL"} (Expected: LABA, Actual: ${result.labaRugi.status})`);
  allPassed &= statusPassed;

  Logger.log(`\nTest F.1 Result: ${allPassed ? "✓ ALL PASSED" : "✗ SOME FAILED"}\n`);
  return allPassed;
}


/**
 * TEST CASE F.2: Moderat (Sewa Tetap)
 */
function testModeratSewaTetap() {
  Logger.log("\n=== TEST F.2: MODERAT (SEWA TETAP) ===");

  const inputData = getBaseInputData();
  const result = calculateScenario(inputData, "moderat", 15, 26);

  let allPassed = true;

  // Test: TBS per Bulan (Kg)
  allPassed &= assertAlmostEqual(result.kebutuhanTBS.perBulan.kg, 23400000, 1, "TBS per Bulan (Kg)");

  // Test: Pemasukan
  allPassed &= assertAlmostEqual(result.cashInflow.totalPerBulan, 79343550000, 100, "Total Pemasukan");

  // Test: Pengeluaran
  allPassed &= assertAlmostEqual(result.cashOutflow.totalPerBulan, 77020350000, 100, "Total Pengeluaran");

  // Test: Laba/Rugi
  allPassed &= assertAlmostEqual(result.labaRugi.perBulan, 2323200000, 100, "Laba per Bulan");

  // Test: Status
  const statusPassed = result.labaRugi.status === "LABA";
  Logger.log(`  Status: ${statusPassed ? "✓ PASS" : "✗ FAIL"} (Expected: LABA, Actual: ${result.labaRugi.status})`);
  allPassed &= statusPassed;

  Logger.log(`\nTest F.2 Result: ${allPassed ? "✓ ALL PASSED" : "✗ SOME FAILED"}\n`);
  return allPassed;
}


/**
 * TEST CASE F.3: Pesimis (Sewa Tetap)
 */
function testPesimisSewatetap() {
  Logger.log("\n=== TEST F.3: PESIMIS (SEWA TETAP) ===");

  const inputData = getBaseInputData();
  const result = calculateScenario(inputData, "pesimis", 10, 26);

  let allPassed = true;

  // Test: TBS per Bulan (Kg)
  allPassed &= assertAlmostEqual(result.kebutuhanTBS.perBulan.kg, 15600000, 1, "TBS per Bulan (Kg)");

  // Test: Pemasukan
  allPassed &= assertAlmostEqual(result.cashInflow.totalPerBulan, 52895700000, 100, "Total Pemasukan");

  // Test: Pengeluaran
  allPassed &= assertAlmostEqual(result.cashOutflow.totalPerBulan, 52038900000, 100, "Total Pengeluaran");

  // Test: Laba/Rugi
  allPassed &= assertAlmostEqual(result.labaRugi.perBulan, 856800000, 100, "Laba per Bulan");

  // Test: Status
  const statusPassed = result.labaRugi.status === "LABA";
  Logger.log(`  Status: ${statusPassed ? "✓ PASS" : "✗ FAIL"} (Expected: LABA, Actual: ${result.labaRugi.status})`);
  allPassed &= statusPassed;

  Logger.log(`\nTest F.3 Result: ${allPassed ? "✓ ALL PASSED" : "✗ SOME FAILED"}\n`);
  return allPassed;
}


/**
 * TEST CASE F.4: Darurat (Sewa Tetap)
 */
function testDaruratSewaTetap() {
  Logger.log("\n=== TEST F.4: DARURAT (SEWA TETAP) ===");

  const inputData = getBaseInputData();
  const result = calculateScenario(inputData, "darurat", 7, 26);

  let allPassed = true;

  // Test: TBS per Bulan (Kg)
  allPassed &= assertAlmostEqual(result.kebutuhanTBS.perBulan.kg, 10920000, 1, "TBS per Bulan (Kg)");

  // Test: CPO per Bulan
  allPassed &= assertAlmostEqual(result.produksi.cpo.perBulan.kg, 2129400, 1, "CPO per Bulan (Kg)");
  allPassed &= assertAlmostEqual(result.produksi.cpo.perBulan.rp, 29492190000, 100, "CPO per Bulan (Rp)");

  // Test: Kernel per Bulan
  allPassed &= assertAlmostEqual(result.produksi.kernel.perBulan.kg, 655200, 1, "Kernel per Bulan (Kg)");
  allPassed &= assertAlmostEqual(result.produksi.kernel.perBulan.rp, 6552000000, 100, "Kernel per Bulan (Rp)");

  // Test: Cangkang per Bulan
  allPassed &= assertAlmostEqual(result.produksi.cangkang.perBulan.kg, 1092000, 1, "Cangkang per Bulan (Kg)");
  allPassed &= assertAlmostEqual(result.produksi.cangkang.perBulan.rp, 982800000, 100, "Cangkang per Bulan (Rp)");

  // Test: Pemasukan
  allPassed &= assertAlmostEqual(result.cashInflow.totalPerBulan, 37026990000, 100, "Total Pemasukan");

  // Test: Pengeluaran
  allPassed &= assertAlmostEqual(result.cashOutflow.totalPerBulan, 37050030000, 100, "Total Pengeluaran");

  // Test: Laba/Rugi
  allPassed &= assertAlmostEqual(result.labaRugi.perBulan, -23040000, 100, "Laba per Bulan");

  // Test: Status
  const statusPassed = result.labaRugi.status === "RUGI";
  Logger.log(`  Status: ${statusPassed ? "✓ PASS" : "✗ FAIL"} (Expected: RUGI, Actual: ${result.labaRugi.status})`);
  allPassed &= statusPassed;

  Logger.log(`\nTest F.4 Result: ${allPassed ? "✓ ALL PASSED" : "✗ SOME FAILED"}\n`);
  return allPassed;
}


/**
 * TEST CASE F.5: Optimis (Sewa Per Kg)
 */
function testOptimisSewaPerKg() {
  Logger.log("\n=== TEST F.5: OPTIMIS (SEWA PER KG) ===");

  const inputData = getBaseInputData();
  // Ubah tipe sewa menjadi per kg
  inputData.biayaTetap.tipeSewa = "perkg";

  const result = calculateScenario(inputData, "optimis", 20, 26);

  let allPassed = true;

  // Test: Sewa PKS
  const expectedSewa = 40 * 31200000; // 1,248,000,000
  allPassed &= assertAlmostEqual(result.cashOutflow.biayaTetap.sewaPKS, expectedSewa, 1, "Sewa PKS (Per Kg)");

  // Test: Total Biaya Tetap
  const expectedBiayaTetap = 1248000000 + 480000000 + 296000000; // 2,024,000,000
  allPassed &= assertAlmostEqual(result.cashOutflow.biayaTetap.subtotal, expectedBiayaTetap, 1, "Total Biaya Tetap");

  // Test: Total Pengeluaran
  const expectedPengeluaran = 101949800000;
  allPassed &= assertAlmostEqual(result.cashOutflow.totalPerBulan, expectedPengeluaran, 100, "Total Pengeluaran");

  // Test: Laba/Rugi
  const expectedLaba = 105791400000 - 101949800000; // 3,841,600,000
  allPassed &= assertAlmostEqual(result.labaRugi.perBulan, expectedLaba, 100, "Laba per Bulan");

  // Test: Status
  const statusPassed = result.labaRugi.status === "LABA";
  Logger.log(`  Status: ${statusPassed ? "✓ PASS" : "✗ FAIL"} (Expected: LABA, Actual: ${result.labaRugi.status})`);
  allPassed &= statusPassed;

  Logger.log(`\nTest F.5 Result: ${allPassed ? "✓ ALL PASSED" : "✗ SOME FAILED"}\n`);
  return allPassed;
}


/**
 * TEST: Cashflow 12 Bulan
 */
function testCashflow12Bulan() {
  Logger.log("\n=== TEST: CASHFLOW 12 BULAN ===");

  const inputData = getBaseInputData();
  const cashflow = calculate12MonthCashflow(inputData);

  let allPassed = true;

  // Test: Jumlah bulan harus 12
  const lengthPassed = cashflow.length === 12;
  Logger.log(`  Jumlah Bulan: ${lengthPassed ? "✓ PASS" : "✗ FAIL"} (Expected: 12, Actual: ${cashflow.length})`);
  allPassed &= lengthPassed;

  // Test: Bulan Januari (Moderat, 15 jam, 26 hari)
  if (cashflow[0]) {
    Logger.log("\n  Checking Januari...");
    const jan = cashflow[0];
    allPassed &= assertAlmostEqual(jan.jamOperasional, 15, 0, "Jam Operasional");
    allPassed &= assertAlmostEqual(jan.hariKerja, 26, 0, "Hari Kerja");
    const expectedJanTBS = 23400000; // 60000 * 15 * 26
    allPassed &= assertAlmostEqual(jan.tbsOlah, expectedJanTBS, 1, "TBS Olah");
  }

  // Test: Bulan Mei (Darurat, 7 jam, 22 hari)
  if (cashflow[4]) {
    Logger.log("\n  Checking Mei...");
    const mei = cashflow[4];
    allPassed &= assertAlmostEqual(mei.jamOperasional, 7, 0, "Jam Operasional");
    allPassed &= assertAlmostEqual(mei.hariKerja, 22, 0, "Hari Kerja");
    const expectedMeiTBS = 60000 * 7 * 22; // 9,240,000
    allPassed &= assertAlmostEqual(mei.tbsOlah, expectedMeiTBS, 1, "TBS Olah");
  }

  // Test: Total tahunan
  let totalTBS = 0;
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let totalLaba = 0;

  for (let i = 0; i < cashflow.length; i++) {
    totalTBS += cashflow[i].tbsOlah;
    totalPemasukan += cashflow[i].pemasukan;
    totalPengeluaran += cashflow[i].pengeluaran;
    totalLaba += cashflow[i].labaBersih;
  }

  Logger.log("\n  Total Tahunan:");
  Logger.log(`    Total TBS Olah: ${formatNumber(totalTBS)} kg`);
  Logger.log(`    Total Pemasukan: Rp ${formatNumber(totalPemasukan)}`);
  Logger.log(`    Total Pengeluaran: Rp ${formatNumber(totalPengeluaran)}`);
  Logger.log(`    Total Laba Bersih: Rp ${formatNumber(totalLaba)}`);

  Logger.log(`\nTest Cashflow 12 Bulan Result: ${allPassed ? "✓ ALL PASSED" : "✗ SOME FAILED"}\n`);
  return allPassed;
}


/**
 * RUN ALL TESTS
 */
function runAllTests() {
  Logger.log("╔═══════════════════════════════════════════════════════════════╗");
  Logger.log("║  KALKULATOR ANALISA PABRIK KELAPA SAWIT - TEST SUITE         ║");
  Logger.log("║  Phase 1: Core Calculations Validation                       ║");
  Logger.log("╚═══════════════════════════════════════════════════════════════╝");

  const results = {
    f1: testOptimisSewatetap(),
    f2: testModeratSewaTetap(),
    f3: testPesimisSewatetap(),
    f4: testDaruratSewaTetap(),
    f5: testOptimisSewaPerKg(),
    cashflow: testCashflow12Bulan()
  };

  Logger.log("\n╔═══════════════════════════════════════════════════════════════╗");
  Logger.log("║  TEST SUMMARY                                                 ║");
  Logger.log("╚═══════════════════════════════════════════════════════════════╝");

  Logger.log(`\n  F.1 - Optimis (Sewa Tetap):     ${results.f1 ? "✓ PASSED" : "✗ FAILED"}`);
  Logger.log(`  F.2 - Moderat (Sewa Tetap):     ${results.f2 ? "✓ PASSED" : "✗ FAILED"}`);
  Logger.log(`  F.3 - Pesimis (Sewa Tetap):     ${results.f3 ? "✓ PASSED" : "✗ FAILED"}`);
  Logger.log(`  F.4 - Darurat (Sewa Tetap):     ${results.f4 ? "✓ PASSED" : "✗ FAILED"}`);
  Logger.log(`  F.5 - Optimis (Sewa Per Kg):    ${results.f5 ? "✓ PASSED" : "✗ FAILED"}`);
  Logger.log(`  Cashflow 12 Bulan:              ${results.cashflow ? "✓ PASSED" : "✗ FAILED"}`);

  const allPassed = Object.values(results).every(r => r === true);

  Logger.log("\n" + "=".repeat(65));
  if (allPassed) {
    Logger.log("  ✓✓✓ ALL TESTS PASSED ✓✓✓");
    Logger.log("  Phase 1: Core Calculations - VALIDATED!");
  } else {
    Logger.log("  ✗✗✗ SOME TESTS FAILED ✗✗✗");
    Logger.log("  Please review failed tests above.");
  }
  Logger.log("=".repeat(65) + "\n");

  return allPassed;
}


/**
 * Quick Test: Run single calculation and show detailed output
 */
function quickTest() {
  const inputData = getBaseInputData();
  const result = calculateScenario(inputData, "optimis", 20, 26);

  Logger.log("\n=== QUICK TEST: OPTIMIS (DETAILED OUTPUT) ===\n");

  Logger.log("KEBUTUHAN TBS:");
  Logger.log(`  Per Hari: ${formatNumber(result.kebutuhanTBS.perHari.kg)} kg = Rp ${formatNumber(result.kebutuhanTBS.perHari.rp)}`);
  Logger.log(`  Per Bulan: ${formatNumber(result.kebutuhanTBS.perBulan.kg)} kg = Rp ${formatNumber(result.kebutuhanTBS.perBulan.rp)}`);

  Logger.log("\nPRODUKSI:");
  Logger.log(`  CPO: ${formatNumber(result.produksi.cpo.perBulan.kg)} kg = Rp ${formatNumber(result.produksi.cpo.perBulan.rp)}`);
  Logger.log(`  Kernel: ${formatNumber(result.produksi.kernel.perBulan.kg)} kg = Rp ${formatNumber(result.produksi.kernel.perBulan.rp)}`);
  Logger.log(`  Cangkang: ${formatNumber(result.produksi.cangkang.perBulan.kg)} kg = Rp ${formatNumber(result.produksi.cangkang.perBulan.rp)}`);

  Logger.log("\nCASH INFLOW:");
  Logger.log(`  Total: Rp ${formatNumber(result.cashInflow.totalPerBulan)}`);
  Logger.log(`  Per Kg TBS: Rp ${formatNumber(result.cashInflow.perKgTBS)}`);
  Logger.log(`  Breakdown:`);
  Logger.log(`    - CPO: ${formatNumber(result.cashInflow.breakdown.cpo.persentase)}%`);
  Logger.log(`    - Kernel: ${formatNumber(result.cashInflow.breakdown.kernel.persentase)}%`);
  Logger.log(`    - Cangkang: ${formatNumber(result.cashInflow.breakdown.cangkang.persentase)}%`);

  Logger.log("\nCASH OUTFLOW:");
  Logger.log(`  Biaya Tetap: Rp ${formatNumber(result.cashOutflow.biayaTetap.subtotal)}`);
  Logger.log(`  Biaya Variable: Rp ${formatNumber(result.cashOutflow.biayaVariable.subtotal)}`);
  Logger.log(`  Biaya Overhead: Rp ${formatNumber(result.cashOutflow.biayaOverhead.total)}`);
  Logger.log(`  Total: Rp ${formatNumber(result.cashOutflow.totalPerBulan)}`);

  Logger.log("\nLABA/RUGI:");
  Logger.log(`  Per Bulan: Rp ${formatNumber(result.labaRugi.perBulan)}`);
  Logger.log(`  Per Tahun: Rp ${formatNumber(result.labaRugi.perTahun)}`);
  Logger.log(`  Per Kg TBS: Rp ${formatNumber(result.labaRugi.perKgTBS)}`);
  Logger.log(`  Status: ${result.labaRugi.status}`);

  Logger.log("\n" + "=".repeat(65) + "\n");
}
