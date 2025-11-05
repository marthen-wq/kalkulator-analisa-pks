/**
 * KALKULATOR ANALISA PABRIK KELAPA SAWIT
 * CORE CALCULATION FUNCTIONS
 *
 * File ini berisi semua fungsi perhitungan inti sesuai spesifikasi:
 * C.1 - Kebutuhan TBS
 * C.2 - Produksi CPO
 * C.3 - Produksi Kernel
 * C.4 - Produksi Cangkang
 * C.5 - Cash Inflow
 * C.6 - Biaya Tetap
 * C.7 - Biaya Variable
 * C.8 - Biaya Overhead
 * C.9 - Total Pengeluaran
 * C.10 - Laba/Rugi
 */


/**
 * C.1: Menghitung Kebutuhan TBS
 *
 * @param {number} kapasitasPerJam - Kapasitas TBS per jam (kg)
 * @param {number} jamOperasional - Jam operasional per hari
 * @param {number} hargaTBS - Harga TBS per kg (Rp)
 * @param {number} hariKerja - Hari kerja per bulan
 * @returns {Object} Kebutuhan TBS per hari dan per bulan
 */
function calculateTBSRequirement(kapasitasPerJam, jamOperasional, hargaTBS, hariKerja) {
  // TBS per Hari (Kg) = Kapasitas TBS per Jam × Jam Operasional
  const tbsPerHariKg = kapasitasPerJam * jamOperasional;

  // TBS per Hari (Rp) = TBS per Hari (Kg) × Harga TBS per Kg
  const tbsPerHariRp = tbsPerHariKg * hargaTBS;

  // TBS per Bulan (Kg) = TBS per Hari (Kg) × Hari Kerja per Bulan
  const tbsPerBulanKg = tbsPerHariKg * hariKerja;

  // TBS per Bulan (Rp) = TBS per Hari (Rp) × Hari Kerja per Bulan
  const tbsPerBulanRp = tbsPerHariRp * hariKerja;

  return {
    perHari: {
      kg: tbsPerHariKg,
      rp: tbsPerHariRp
    },
    perBulan: {
      kg: tbsPerBulanKg,
      rp: tbsPerBulanRp
    }
  };
}


/**
 * C.2: Menghitung Produksi CPO
 *
 * @param {number} tbsPerHariKg - TBS per hari dalam kg
 * @param {number} oer - Oil Extraction Rate (0-1)
 * @param {number} hargaCPO - Harga CPO per kg (Rp)
 * @param {number} hariKerja - Hari kerja per bulan
 * @returns {Object} Produksi CPO per hari, per bulan, dan per kg TBS
 */
function calculateCPOProduction(tbsPerHariKg, oer, hargaCPO, hariKerja) {
  // CPO per Hari (Kg) = TBS per Hari (Kg) × OER
  const cpoPerHariKg = tbsPerHariKg * oer;

  // CPO per Bulan (Kg) = CPO per Hari (Kg) × Hari Kerja
  const cpoPerBulanKg = cpoPerHariKg * hariKerja;

  // CPO per Hari (Rp) = CPO per Hari (Kg) × Harga CPO
  const cpoPerHariRp = cpoPerHariKg * hargaCPO;

  // CPO per Bulan (Rp) = CPO per Hari (Rp) × Hari Kerja
  const cpoPerBulanRp = cpoPerHariRp * hariKerja;

  // CPO per Kg TBS = CPO per Hari (Rp) / TBS per Hari (Kg)
  const cpoPerKgTBS = cpoPerHariRp / tbsPerHariKg;

  return {
    perHari: {
      kg: cpoPerHariKg,
      rp: cpoPerHariRp
    },
    perBulan: {
      kg: cpoPerBulanKg,
      rp: cpoPerBulanRp
    },
    perKgTBS: cpoPerKgTBS
  };
}


/**
 * C.3: Menghitung Produksi Kernel
 *
 * @param {number} tbsPerHariKg - TBS per hari dalam kg
 * @param {number} ker - Kernel Extraction Rate (0-1)
 * @param {number} hargaKernel - Harga Kernel per kg (Rp)
 * @param {number} hariKerja - Hari kerja per bulan
 * @returns {Object} Produksi Kernel per hari, per bulan, dan per kg TBS
 */
function calculateKernelProduction(tbsPerHariKg, ker, hargaKernel, hariKerja) {
  // Kernel per Hari (Kg) = TBS per Hari (Kg) × KER
  const kernelPerHariKg = tbsPerHariKg * ker;

  // Kernel per Bulan (Kg) = Kernel per Hari (Kg) × Hari Kerja
  const kernelPerBulanKg = kernelPerHariKg * hariKerja;

  // Kernel per Hari (Rp) = Kernel per Hari (Kg) × Harga Kernel
  const kernelPerHariRp = kernelPerHariKg * hargaKernel;

  // Kernel per Bulan (Rp) = Kernel per Hari (Rp) × Hari Kerja
  const kernelPerBulanRp = kernelPerHariRp * hariKerja;

  // Kernel per Kg TBS = Kernel per Hari (Rp) / TBS per Hari (Kg)
  const kernelPerKgTBS = kernelPerHariRp / tbsPerHariKg;

  return {
    perHari: {
      kg: kernelPerHariKg,
      rp: kernelPerHariRp
    },
    perBulan: {
      kg: kernelPerBulanKg,
      rp: kernelPerBulanRp
    },
    perKgTBS: kernelPerKgTBS
  };
}


/**
 * C.4: Menghitung Produksi Cangkang
 *
 * @param {number} tbsPerHariKg - TBS per hari dalam kg
 * @param {number} rendemenCangkang - Rendemen cangkang (0-1)
 * @param {number} hargaCangkang - Harga cangkang per kg (Rp)
 * @param {number} hariKerja - Hari kerja per bulan
 * @returns {Object} Produksi Cangkang per hari, per bulan, dan per kg TBS
 */
function calculateCangkangProduction(tbsPerHariKg, rendemenCangkang, hargaCangkang, hariKerja) {
  // Cangkang per Hari (Kg) = TBS per Hari (Kg) × Rendemen Cangkang
  const cangkangPerHariKg = tbsPerHariKg * rendemenCangkang;

  // Cangkang per Bulan (Kg) = Cangkang per Hari (Kg) × Hari Kerja
  const cangkangPerBulanKg = cangkangPerHariKg * hariKerja;

  // Cangkang per Hari (Rp) = Cangkang per Hari (Kg) × Harga Cangkang
  const cangkangPerHariRp = cangkangPerHariKg * hargaCangkang;

  // Cangkang per Bulan (Rp) = Cangkang per Hari (Rp) × Hari Kerja
  const cangkangPerBulanRp = cangkangPerHariRp * hariKerja;

  // Cangkang per Kg TBS = Cangkang per Hari (Rp) / TBS per Hari (Kg)
  const cangkangPerKgTBS = cangkangPerHariRp / tbsPerHariKg;

  return {
    perHari: {
      kg: cangkangPerHariKg,
      rp: cangkangPerHariRp
    },
    perBulan: {
      kg: cangkangPerBulanKg,
      rp: cangkangPerBulanRp
    },
    perKgTBS: cangkangPerKgTBS
  };
}


/**
 * C.5: Menghitung Cash Inflow (Pemasukan)
 *
 * @param {Object} cpo - Hasil perhitungan CPO
 * @param {Object} kernel - Hasil perhitungan Kernel
 * @param {Object} cangkang - Hasil perhitungan Cangkang
 * @param {number} tbsPerBulanKg - TBS per bulan dalam kg
 * @returns {Object} Total pemasukan dengan breakdown
 */
function calculateCashInflow(cpo, kernel, cangkang, tbsPerBulanKg) {
  // Total Pemasukan = CPO + Kernel + Cangkang
  const totalPerBulan = cpo.perBulan.rp + kernel.perBulan.rp + cangkang.perBulan.rp;

  // Pemasukan per Kg TBS
  const perKgTBS = totalPerBulan / tbsPerBulanKg;

  // Breakdown persentase
  const persentaseCPO = (cpo.perBulan.rp / totalPerBulan) * 100;
  const persentaseKernel = (kernel.perBulan.rp / totalPerBulan) * 100;
  const persentaseCangkang = (cangkang.perBulan.rp / totalPerBulan) * 100;

  return {
    totalPerBulan: totalPerBulan,
    perKgTBS: perKgTBS,
    breakdown: {
      cpo: {
        nilai: cpo.perBulan.rp,
        persentase: persentaseCPO
      },
      kernel: {
        nilai: kernel.perBulan.rp,
        persentase: persentaseKernel
      },
      cangkang: {
        nilai: cangkang.perBulan.rp,
        persentase: persentaseCangkang
      }
    }
  };
}


/**
 * C.6: Menghitung Biaya Tetap
 *
 * @param {Object} inputData - Data input dari user
 * @param {number} tbsPerBulanKg - TBS per bulan dalam kg
 * @returns {Object} Biaya tetap
 */
function calculateFixedCosts(inputData, tbsPerBulanKg) {
  const biayaTetap = inputData.biayaTetap;
  let sewaPKS = 0;

  // Hitung sewa berdasarkan tipe
  if (biayaTetap.tipeSewa === 'tetap') {
    sewaPKS = biayaTetap.sewaTetap;
  } else if (biayaTetap.tipeSewa === 'perkg') {
    sewaPKS = biayaTetap.sewaPerKg * tbsPerBulanKg;
  }

  const gajiKaryawan = biayaTetap.gajiKaryawan;
  const gajiManajemen = biayaTetap.gajiManajemen;

  // Total Biaya Tetap
  const subtotal = sewaPKS + gajiKaryawan + gajiManajemen;

  // Biaya Tetap per Kg
  const perKgTBS = subtotal / tbsPerBulanKg;

  return {
    sewaPKS: sewaPKS,
    gajiKaryawan: gajiKaryawan,
    gajiManajemen: gajiManajemen,
    subtotal: subtotal,
    perKgTBS: perKgTBS
  };
}


/**
 * C.7: Menghitung Biaya Variable
 *
 * @param {Object} inputData - Data input dari user
 * @param {number} tbsPerBulanKg - TBS per bulan dalam kg
 * @param {number} tbsPerBulanRp - TBS per bulan dalam Rp
 * @param {number} cpoPerBulanKg - CPO per bulan dalam kg
 * @returns {Object} Biaya variable
 */
function calculateVariableCosts(inputData, tbsPerBulanKg, tbsPerBulanRp, cpoPerBulanKg) {
  const biayaPerKg = inputData.biayaPerKg;

  // Beli TBS
  const beliTBS = tbsPerBulanRp;

  // Sparepart & Chemical = Biaya per Kg × TBS per Bulan (Kg)
  const sparepartChemical = biayaPerKg.sparepartChemical * tbsPerBulanKg;

  // Ongkos Angkut CPO = Biaya per Kg × CPO per Bulan (Kg)
  const ongkosAngkutCPO = biayaPerKg.ongkosAngkutCPO * cpoPerBulanKg;

  // Biaya Umum = Biaya per Kg × TBS per Bulan (Kg)
  const biayaUmum = biayaPerKg.biayaUmum * tbsPerBulanKg;

  // Total Biaya Variable
  const subtotal = beliTBS + sparepartChemical + ongkosAngkutCPO + biayaUmum;

  // Biaya Variable per Kg
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


/**
 * C.8: Menghitung Biaya Overhead
 *
 * @param {Object} inputData - Data input dari user
 * @param {number} tbsPerBulanKg - TBS per bulan dalam kg
 * @returns {Object} Biaya overhead
 */
function calculateOverheadCosts(inputData, tbsPerBulanKg) {
  const overheadPerKg = inputData.biayaPerKg.overhead;

  // Biaya Overhead = Overhead per Kg × TBS per Bulan (Kg)
  const total = overheadPerKg * tbsPerBulanKg;

  // Overhead per Kg (sama dengan input)
  const perKgTBS = total / tbsPerBulanKg;

  return {
    total: total,
    perKgTBS: perKgTBS
  };
}


/**
 * C.9: Menghitung Total Pengeluaran
 *
 * @param {Object} biayaTetap - Hasil perhitungan biaya tetap
 * @param {Object} biayaVariable - Hasil perhitungan biaya variable
 * @param {Object} biayaOverhead - Hasil perhitungan biaya overhead
 * @param {number} tbsPerBulanKg - TBS per bulan dalam kg
 * @returns {Object} Total pengeluaran
 */
function calculateTotalOutflow(biayaTetap, biayaVariable, biayaOverhead, tbsPerBulanKg) {
  // Total Pengeluaran = Biaya Tetap + Biaya Variable + Biaya Overhead
  const totalPerBulan = biayaTetap.subtotal + biayaVariable.subtotal + biayaOverhead.total;

  // Pengeluaran per Kg
  const perKgTBS = totalPerBulan / tbsPerBulanKg;

  return {
    totalPerBulan: totalPerBulan,
    perKgTBS: perKgTBS
  };
}


/**
 * C.10: Menghitung Laba/Rugi
 *
 * @param {number} totalPemasukan - Total pemasukan per bulan
 * @param {number} totalPengeluaran - Total pengeluaran per bulan
 * @param {number} tbsPerBulanKg - TBS per bulan dalam kg
 * @returns {Object} Laba/Rugi
 */
function calculateProfitLoss(totalPemasukan, totalPengeluaran, tbsPerBulanKg) {
  // Laba/Rugi per Bulan = Total Pemasukan - Total Pengeluaran
  const perBulan = totalPemasukan - totalPengeluaran;

  // Laba/Rugi per Tahun = Laba/Rugi per Bulan × 12
  const perTahun = perBulan * 12;

  // Laba/Rugi per Kg = Laba/Rugi per Bulan / TBS per Bulan (Kg)
  const perKgTBS = perBulan / tbsPerBulanKg;

  // Status = IF(Laba/Rugi >= 0, "LABA", "RUGI")
  const status = perBulan >= 0 ? "LABA" : "RUGI";

  return {
    perBulan: perBulan,
    perTahun: perTahun,
    perKgTBS: perKgTBS,
    status: status
  };
}


/**
 * Menghitung semua parameter untuk satu skenario
 *
 * @param {Object} inputData - Data input dari user
 * @param {string} skenarioName - Nama skenario (optimis, moderat, pesimis, darurat)
 * @param {number} jamOperasional - Jam operasional untuk skenario ini
 * @param {number} hariKerja - Hari kerja per bulan (default 26)
 * @returns {Object} Output lengkap untuk skenario
 */
function calculateScenario(inputData, skenarioName, jamOperasional, hariKerja = 26) {
  // C.1: Kebutuhan TBS
  const kebutuhanTBS = calculateTBSRequirement(
    inputData.kapasitas.tbsPerJam,
    jamOperasional,
    inputData.hargaBeli.tbs,
    hariKerja
  );

  // C.2: Produksi CPO
  const cpo = calculateCPOProduction(
    kebutuhanTBS.perHari.kg,
    inputData.rendemen.oer,
    inputData.hargaJual.cpo,
    hariKerja
  );

  // C.3: Produksi Kernel
  const kernel = calculateKernelProduction(
    kebutuhanTBS.perHari.kg,
    inputData.rendemen.ker,
    inputData.hargaJual.kernel,
    hariKerja
  );

  // C.4: Produksi Cangkang
  const cangkang = calculateCangkangProduction(
    kebutuhanTBS.perHari.kg,
    inputData.rendemen.cangkang,
    inputData.hargaJual.cangkang,
    hariKerja
  );

  // C.5: Cash Inflow
  const cashInflow = calculateCashInflow(
    cpo,
    kernel,
    cangkang,
    kebutuhanTBS.perBulan.kg
  );

  // C.6: Biaya Tetap
  const biayaTetap = calculateFixedCosts(
    inputData,
    kebutuhanTBS.perBulan.kg
  );

  // C.7: Biaya Variable
  const biayaVariable = calculateVariableCosts(
    inputData,
    kebutuhanTBS.perBulan.kg,
    kebutuhanTBS.perBulan.rp,
    cpo.perBulan.kg
  );

  // C.8: Biaya Overhead
  const biayaOverhead = calculateOverheadCosts(
    inputData,
    kebutuhanTBS.perBulan.kg
  );

  // C.9: Total Pengeluaran
  const cashOutflow = calculateTotalOutflow(
    biayaTetap,
    biayaVariable,
    biayaOverhead,
    kebutuhanTBS.perBulan.kg
  );

  // C.10: Laba/Rugi
  const labaRugi = calculateProfitLoss(
    cashInflow.totalPerBulan,
    cashOutflow.totalPerBulan,
    kebutuhanTBS.perBulan.kg
  );

  // Kembalikan output lengkap
  return {
    skenario: skenarioName,
    jamOperasional: jamOperasional,
    hariKerja: hariKerja,
    kebutuhanTBS: kebutuhanTBS,
    produksi: {
      cpo: cpo,
      kernel: kernel,
      cangkang: cangkang
    },
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


/**
 * Menghitung Cashflow 12 Bulan
 *
 * @param {Object} inputData - Data input dari user
 * @param {Array} monthlyPattern - Pattern bulan (opsional, gunakan default jika null)
 * @returns {Array} Array berisi cashflow 12 bulan
 */
function calculate12MonthCashflow(inputData, monthlyPattern = null) {
  // Default pattern sesuai spesifikasi D.2 dan D.4
  const defaultPattern = [
    { bulan: "Januari", skenario: "moderat", jam: 15, hariKerja: 26, kategori: "Normal" },
    { bulan: "Februari", skenario: "optimis", jam: 20, hariKerja: 24, kategori: "Puncak Panen" },
    { bulan: "Maret", skenario: "optimis", jam: 20, hariKerja: 26, kategori: "Puncak Panen" },
    { bulan: "April", skenario: "pesimis", jam: 10, hariKerja: 24, kategori: "Libur Puasa" },
    { bulan: "Mei", skenario: "darurat", jam: 7, hariKerja: 22, kategori: "Libur Lebaran" },
    { bulan: "Juni", skenario: "moderat", jam: 15, hariKerja: 26, kategori: "Normal" },
    { bulan: "Juli", skenario: "optimis", jam: 20, hariKerja: 26, kategori: "Puncak Panen" },
    { bulan: "Agustus", skenario: "moderat", jam: 15, hariKerja: 26, kategori: "Normal" },
    { bulan: "September", skenario: "pesimis", jam: 10, hariKerja: 26, kategori: "Sepi Panen" },
    { bulan: "Oktober", skenario: "pesimis", jam: 10, hariKerja: 26, kategori: "Sepi Panen" },
    { bulan: "November", skenario: "pesimis", jam: 10, hariKerja: 26, kategori: "Sepi Panen" },
    { bulan: "Desember", skenario: "darurat", jam: 7, hariKerja: 24, kategori: "Libur Natal" }
  ];

  const pattern = monthlyPattern || defaultPattern;
  const cashflow = [];

  // Hitung untuk setiap bulan
  for (let i = 0; i < pattern.length; i++) {
    const month = pattern[i];

    // Ambil jam operasional dari input skenario
    let jamOperasional = month.jam;
    if (month.skenario === 'optimis') {
      jamOperasional = inputData.skenario.optimis;
    } else if (month.skenario === 'moderat') {
      jamOperasional = inputData.skenario.moderat;
    } else if (month.skenario === 'pesimis') {
      jamOperasional = inputData.skenario.pesimis;
    } else if (month.skenario === 'darurat') {
      jamOperasional = inputData.skenario.darurat;
    }

    // Hitung skenario untuk bulan ini
    const result = calculateScenario(inputData, month.skenario, jamOperasional, month.hariKerja);

    // Tambahkan ke array cashflow
    cashflow.push({
      bulan: month.bulan,
      bulanIndex: i + 1,
      skenario: month.skenario,
      jamOperasional: jamOperasional,
      kategoriMusim: month.kategori,
      hariKerja: month.hariKerja,
      tbsOlah: result.kebutuhanTBS.perBulan.kg,
      pemasukan: result.cashInflow.totalPerBulan,
      pengeluaran: result.cashOutflow.totalPerBulan,
      labaBersih: result.labaRugi.perBulan,
      status: result.labaRugi.status
    });
  }

  return cashflow;
}
