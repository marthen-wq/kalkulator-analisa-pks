/**
 * STANDALONE JAVASCRIPT VERSION
 * Untuk testing di Node.js tanpa Google Apps Script dependencies
 *
 * Cara run:
 * node local-test/standalone-test.js
 */

// ============================================================================
// CORE CALCULATION FUNCTIONS (sama seperti Calculations.gs)
// ============================================================================

function calculateTBSRequirement(kapasitasPerJam, jamOperasional, hargaTBS, hariKerja) {
  const tbsPerHariKg = kapasitasPerJam * jamOperasional;
  const tbsPerHariRp = tbsPerHariKg * hargaTBS;
  const tbsPerBulanKg = tbsPerHariKg * hariKerja;
  const tbsPerBulanRp = tbsPerHariRp * hariKerja;

  return {
    perHari: { kg: tbsPerHariKg, rp: tbsPerHariRp },
    perBulan: { kg: tbsPerBulanKg, rp: tbsPerBulanRp }
  };
}

function calculateCPOProduction(tbsPerHariKg, oer, hargaCPO, hariKerja) {
  const cpoPerHariKg = tbsPerHariKg * oer;
  const cpoPerBulanKg = cpoPerHariKg * hariKerja;
  const cpoPerHariRp = cpoPerHariKg * hargaCPO;
  const cpoPerBulanRp = cpoPerHariRp * hariKerja;
  const cpoPerKgTBS = cpoPerHariRp / tbsPerHariKg;

  return {
    perHari: { kg: cpoPerHariKg, rp: cpoPerHariRp },
    perBulan: { kg: cpoPerBulanKg, rp: cpoPerBulanRp },
    perKgTBS: cpoPerKgTBS
  };
}

function calculateKernelProduction(tbsPerHariKg, ker, hargaKernel, hariKerja) {
  const kernelPerHariKg = tbsPerHariKg * ker;
  const kernelPerBulanKg = kernelPerHariKg * hariKerja;
  const kernelPerHariRp = kernelPerHariKg * hargaKernel;
  const kernelPerBulanRp = kernelPerHariRp * hariKerja;
  const kernelPerKgTBS = kernelPerHariRp / tbsPerHariKg;

  return {
    perHari: { kg: kernelPerHariKg, rp: kernelPerHariRp },
    perBulan: { kg: kernelPerBulanKg, rp: kernelPerBulanRp },
    perKgTBS: kernelPerKgTBS
  };
}

function calculateCangkangProduction(tbsPerHariKg, rendemenCangkang, hargaCangkang, hariKerja) {
  const cangkangPerHariKg = tbsPerHariKg * rendemenCangkang;
  const cangkangPerBulanKg = cangkangPerHariKg * hariKerja;
  const cangkangPerHariRp = cangkangPerHariKg * hargaCangkang;
  const cangkangPerBulanRp = cangkangPerHariRp * hariKerja;
  const cangkangPerKgTBS = cangkangPerHariRp / tbsPerHariKg;

  return {
    perHari: { kg: cangkangPerHariKg, rp: cangkangPerHariRp },
    perBulan: { kg: cangkangPerBulanKg, rp: cangkangPerBulanRp },
    perKgTBS: cangkangPerKgTBS
  };
}

function calculateCashInflow(cpo, kernel, cangkang, tbsPerBulanKg) {
  const totalPerBulan = cpo.perBulan.rp + kernel.perBulan.rp + cangkang.perBulan.rp;
  const perKgTBS = totalPerBulan / tbsPerBulanKg;
  const persentaseCPO = (cpo.perBulan.rp / totalPerBulan) * 100;
  const persentaseKernel = (kernel.perBulan.rp / totalPerBulan) * 100;
  const persentaseCangkang = (cangkang.perBulan.rp / totalPerBulan) * 100;

  return {
    totalPerBulan: totalPerBulan,
    perKgTBS: perKgTBS,
    breakdown: {
      cpo: { nilai: cpo.perBulan.rp, persentase: persentaseCPO },
      kernel: { nilai: kernel.perBulan.rp, persentase: persentaseKernel },
      cangkang: { nilai: cangkang.perBulan.rp, persentase: persentaseCangkang }
    }
  };
}

function calculateFixedCosts(inputData, tbsPerBulanKg) {
  const biayaTetap = inputData.biayaTetap;
  let sewaPKS = 0;

  if (biayaTetap.tipeSewa === 'tetap') {
    sewaPKS = biayaTetap.sewaTetap;
  } else if (biayaTetap.tipeSewa === 'perkg') {
    sewaPKS = biayaTetap.sewaPerKg * tbsPerBulanKg;
  }

  const gajiKaryawan = biayaTetap.gajiKaryawan;
  const gajiManajemen = biayaTetap.gajiManajemen;
  const subtotal = sewaPKS + gajiKaryawan + gajiManajemen;
  const perKgTBS = subtotal / tbsPerBulanKg;

  return {
    sewaPKS: sewaPKS,
    gajiKaryawan: gajiKaryawan,
    gajiManajemen: gajiManajemen,
    subtotal: subtotal,
    perKgTBS: perKgTBS
  };
}

function calculateVariableCosts(inputData, tbsPerBulanKg, tbsPerBulanRp, cpoPerBulanKg) {
  const biayaPerKg = inputData.biayaPerKg;
  const beliTBS = tbsPerBulanRp;
  const sparepartChemical = biayaPerKg.sparepartChemical * tbsPerBulanKg;
  const ongkosAngkutCPO = biayaPerKg.ongkosAngkutCPO * cpoPerBulanKg;
  const biayaUmum = biayaPerKg.biayaUmum * tbsPerBulanKg;
  const subtotal = beliTBS + sparepartChemical + ongkosAngkutCPO + biayaUmum;
  const perKgTBS = subtotal / tbsPerBulanKg;

  return {
    beliTBS: beliTBS,
    sparepartChemical: sparepartChemical,
    ongkosAngkutCPO: ongkosAngkutCPO,
    biayaUmum: biayaUmum,
    subtotal: subtotal,
    perKgTBS: perKgTBS
  };
}

function calculateOverheadCosts(inputData, tbsPerBulanKg) {
  const overheadPerKg = inputData.biayaPerKg.overhead;
  const total = overheadPerKg * tbsPerBulanKg;
  const perKgTBS = total / tbsPerBulanKg;

  return { total: total, perKgTBS: perKgTBS };
}

function calculateTotalOutflow(biayaTetap, biayaVariable, biayaOverhead, tbsPerBulanKg) {
  const totalPerBulan = biayaTetap.subtotal + biayaVariable.subtotal + biayaOverhead.total;
  const perKgTBS = totalPerBulan / tbsPerBulanKg;

  return { totalPerBulan: totalPerBulan, perKgTBS: perKgTBS };
}

function calculateProfitLoss(totalPemasukan, totalPengeluaran, tbsPerBulanKg) {
  const perBulan = totalPemasukan - totalPengeluaran;
  const perTahun = perBulan * 12;
  const perKgTBS = perBulan / tbsPerBulanKg;
  const status = perBulan >= 0 ? "LABA" : "RUGI";

  return {
    perBulan: perBulan,
    perTahun: perTahun,
    perKgTBS: perKgTBS,
    status: status
  };
}

function calculateScenario(inputData, skenarioName, jamOperasional, hariKerja = 26) {
  const kebutuhanTBS = calculateTBSRequirement(
    inputData.kapasitas.tbsPerJam,
    jamOperasional,
    inputData.hargaBeli.tbs,
    hariKerja
  );

  const cpo = calculateCPOProduction(
    kebutuhanTBS.perHari.kg,
    inputData.rendemen.oer,
    inputData.hargaJual.cpo,
    hariKerja
  );

  const kernel = calculateKernelProduction(
    kebutuhanTBS.perHari.kg,
    inputData.rendemen.ker,
    inputData.hargaJual.kernel,
    hariKerja
  );

  const cangkang = calculateCangkangProduction(
    kebutuhanTBS.perHari.kg,
    inputData.rendemen.cangkang,
    inputData.hargaJual.cangkang,
    hariKerja
  );

  const cashInflow = calculateCashInflow(cpo, kernel, cangkang, kebutuhanTBS.perBulan.kg);
  const biayaTetap = calculateFixedCosts(inputData, kebutuhanTBS.perBulan.kg);
  const biayaVariable = calculateVariableCosts(
    inputData,
    kebutuhanTBS.perBulan.kg,
    kebutuhanTBS.perBulan.rp,
    cpo.perBulan.kg
  );
  const biayaOverhead = calculateOverheadCosts(inputData, kebutuhanTBS.perBulan.kg);
  const cashOutflow = calculateTotalOutflow(
    biayaTetap,
    biayaVariable,
    biayaOverhead,
    kebutuhanTBS.perBulan.kg
  );
  const labaRugi = calculateProfitLoss(
    cashInflow.totalPerBulan,
    cashOutflow.totalPerBulan,
    kebutuhanTBS.perBulan.kg
  );

  return {
    skenario: skenarioName,
    jamOperasional: jamOperasional,
    hariKerja: hariKerja,
    kebutuhanTBS: kebutuhanTBS,
    produksi: { cpo: cpo, kernel: kernel, cangkang: cangkang },
    cashInflow: cashInflow,
    cashOutflow: {
      biayaTetap: biayaTetap,
      biayaVariable: biayaVariable,
      biayaOverhead: biayaOverhead,
      totalPerBulan: cashOutflow.totalPerBulan,
      perKgTBS: cashOutflow.perKgTBS
    },
    labaRugi: labaRugi
  };
}

// ============================================================================
// TEST DATA
// ============================================================================

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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatNumber(num) {
  return num.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

function assertAlmostEqual(actual, expected, tolerance = 1, label = "") {
  const diff = Math.abs(actual - expected);
  const passed = diff <= tolerance;
  const status = passed ? "✓ PASS" : "✗ FAIL";
  const prefix = label ? `  ${label}: ` : "  ";

  console.log(prefix + status);
  console.log(`    Expected: ${formatNumber(expected)}`);
  console.log(`    Actual:   ${formatNumber(actual)}`);
  console.log(`    Diff:     ${formatNumber(diff)}`);

  return passed;
}

// ============================================================================
// TEST CASES
// ============================================================================

function testOptimisSewatetap() {
  console.log("\n=== TEST F.1: OPTIMIS (SEWA TETAP) ===");

  const inputData = getBaseInputData();
  const result = calculateScenario(inputData, "optimis", 20, 26);

  let allPassed = true;

  allPassed &= assertAlmostEqual(result.kebutuhanTBS.perBulan.kg, 31200000, 1, "TBS per Bulan (Kg)");
  allPassed &= assertAlmostEqual(result.cashInflow.totalPerBulan, 105791400000, 100, "Total Pemasukan");
  allPassed &= assertAlmostEqual(result.cashOutflow.totalPerBulan, 102001800000, 100, "Total Pengeluaran");
  allPassed &= assertAlmostEqual(result.labaRugi.perBulan, 3789600000, 100, "Laba per Bulan");

  const statusPassed = result.labaRugi.status === "LABA";
  console.log(`  Status: ${statusPassed ? "✓ PASS" : "✗ FAIL"} (Expected: LABA, Actual: ${result.labaRugi.status})`);
  allPassed &= statusPassed;

  console.log(`\nTest F.1 Result: ${allPassed ? "✓ ALL PASSED" : "✗ SOME FAILED"}\n`);
  return allPassed;
}

function testModeratSewaTetap() {
  console.log("\n=== TEST F.2: MODERAT (SEWA TETAP) ===");

  const inputData = getBaseInputData();
  const result = calculateScenario(inputData, "moderat", 15, 26);

  let allPassed = true;

  allPassed &= assertAlmostEqual(result.kebutuhanTBS.perBulan.kg, 23400000, 1, "TBS per Bulan (Kg)");
  allPassed &= assertAlmostEqual(result.cashInflow.totalPerBulan, 79343550000, 100, "Total Pemasukan");
  allPassed &= assertAlmostEqual(result.cashOutflow.totalPerBulan, 77020350000, 100, "Total Pengeluaran");
  allPassed &= assertAlmostEqual(result.labaRugi.perBulan, 2323200000, 100, "Laba per Bulan");

  const statusPassed = result.labaRugi.status === "LABA";
  console.log(`  Status: ${statusPassed ? "✓ PASS" : "✗ FAIL"} (Expected: LABA, Actual: ${result.labaRugi.status})`);
  allPassed &= statusPassed;

  console.log(`\nTest F.2 Result: ${allPassed ? "✓ ALL PASSED" : "✗ SOME FAILED"}\n`);
  return allPassed;
}

function testDaruratSewaTetap() {
  console.log("\n=== TEST F.4: DARURAT (SEWA TETAP) ===");

  const inputData = getBaseInputData();
  const result = calculateScenario(inputData, "darurat", 7, 26);

  let allPassed = true;

  allPassed &= assertAlmostEqual(result.kebutuhanTBS.perBulan.kg, 10920000, 1, "TBS per Bulan (Kg)");
  allPassed &= assertAlmostEqual(result.cashInflow.totalPerBulan, 37026990000, 100, "Total Pemasukan");
  allPassed &= assertAlmostEqual(result.cashOutflow.totalPerBulan, 37050030000, 100, "Total Pengeluaran");
  allPassed &= assertAlmostEqual(result.labaRugi.perBulan, -23040000, 100, "Laba per Bulan");

  const statusPassed = result.labaRugi.status === "RUGI";
  console.log(`  Status: ${statusPassed ? "✓ PASS" : "✗ FAIL"} (Expected: RUGI, Actual: ${result.labaRugi.status})`);
  allPassed &= statusPassed;

  console.log(`\nTest F.4 Result: ${allPassed ? "✓ ALL PASSED" : "✗ SOME FAILED"}\n`);
  return allPassed;
}

function runAllTests() {
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║  KALKULATOR ANALISA PABRIK KELAPA SAWIT - LOCAL TEST         ║");
  console.log("║  Phase 1: Core Calculations Validation                       ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝");

  const results = {
    f1: testOptimisSewatetap(),
    f2: testModeratSewaTetap(),
    f4: testDaruratSewaTetap()
  };

  console.log("\n╔═══════════════════════════════════════════════════════════════╗");
  console.log("║  TEST SUMMARY                                                 ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝");

  console.log(`\n  F.1 - Optimis (Sewa Tetap):     ${results.f1 ? "✓ PASSED" : "✗ FAILED"}`);
  console.log(`  F.2 - Moderat (Sewa Tetap):     ${results.f2 ? "✓ PASSED" : "✗ FAILED"}`);
  console.log(`  F.4 - Darurat (Sewa Tetap):     ${results.f4 ? "✓ PASSED" : "✗ FAILED"}`);

  const allPassed = Object.values(results).every(r => r === true);

  console.log("\n" + "=".repeat(65));
  if (allPassed) {
    console.log("  ✓✓✓ ALL TESTS PASSED ✓✓✓");
    console.log("  Phase 1: Core Calculations - VALIDATED!");
  } else {
    console.log("  ✗✗✗ SOME TESTS FAILED ✗✗✗");
    console.log("  Please review failed tests above.");
  }
  console.log("=".repeat(65) + "\n");

  return allPassed;
}

function quickDemo() {
  console.log("\n=== QUICK DEMO: OPTIMIS (DETAILED OUTPUT) ===\n");

  const inputData = getBaseInputData();
  const result = calculateScenario(inputData, "optimis", 20, 26);

  console.log("KEBUTUHAN TBS:");
  console.log(`  Per Hari: ${formatNumber(result.kebutuhanTBS.perHari.kg)} kg = Rp ${formatNumber(result.kebutuhanTBS.perHari.rp)}`);
  console.log(`  Per Bulan: ${formatNumber(result.kebutuhanTBS.perBulan.kg)} kg = Rp ${formatNumber(result.kebutuhanTBS.perBulan.rp)}`);

  console.log("\nPRODUKSI:");
  console.log(`  CPO: ${formatNumber(result.produksi.cpo.perBulan.kg)} kg = Rp ${formatNumber(result.produksi.cpo.perBulan.rp)}`);
  console.log(`  Kernel: ${formatNumber(result.produksi.kernel.perBulan.kg)} kg = Rp ${formatNumber(result.produksi.kernel.perBulan.rp)}`);
  console.log(`  Cangkang: ${formatNumber(result.produksi.cangkang.perBulan.kg)} kg = Rp ${formatNumber(result.produksi.cangkang.perBulan.rp)}`);

  console.log("\nCASH INFLOW:");
  console.log(`  Total: Rp ${formatNumber(result.cashInflow.totalPerBulan)}`);
  console.log(`  Per Kg TBS: Rp ${formatNumber(result.cashInflow.perKgTBS)}`);
  console.log(`  Breakdown:`);
  console.log(`    - CPO: ${formatNumber(result.cashInflow.breakdown.cpo.persentase)}%`);
  console.log(`    - Kernel: ${formatNumber(result.cashInflow.breakdown.kernel.persentase)}%`);
  console.log(`    - Cangkang: ${formatNumber(result.cashInflow.breakdown.cangkang.persentase)}%`);

  console.log("\nCASH OUTFLOW:");
  console.log(`  Biaya Tetap: Rp ${formatNumber(result.cashOutflow.biayaTetap.subtotal)}`);
  console.log(`  Biaya Variable: Rp ${formatNumber(result.cashOutflow.biayaVariable.subtotal)}`);
  console.log(`  Biaya Overhead: Rp ${formatNumber(result.cashOutflow.biayaOverhead.total)}`);
  console.log(`  Total: Rp ${formatNumber(result.cashOutflow.totalPerBulan)}`);

  console.log("\nLABA/RUGI:");
  console.log(`  Per Bulan: Rp ${formatNumber(result.labaRugi.perBulan)}`);
  console.log(`  Per Tahun: Rp ${formatNumber(result.labaRugi.perTahun)}`);
  console.log(`  Per Kg TBS: Rp ${formatNumber(result.labaRugi.perKgTBS)}`);
  console.log(`  Status: ${result.labaRugi.status}`);

  console.log("\n" + "=".repeat(65) + "\n");
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log("\n🧪 Pilih mode test:\n");
console.log("1. runAllTests()    - Jalankan semua test");
console.log("2. quickDemo()      - Demo perhitungan Optimis\n");

// Uncomment salah satu untuk run:
// runAllTests();
quickDemo();
