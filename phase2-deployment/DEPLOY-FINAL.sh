#!/bin/bash

# Script untuk deploy final - hapus semua file lama dan download fresh

echo "==================================="
echo "FINAL DEPLOYMENT SCRIPT"
echo "==================================="
echo ""

# Navigasi ke folder gas
cd /Users/martaen/gas || exit 1

echo "Step 1: Backup file lama (jika ada)"
if [ -f "Code.js" ]; then
  mkdir -p backup_$(date +%Y%m%d_%H%M%S)
  mv *.html *.js backup_$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
  echo "✓ File lama di-backup"
fi

echo ""
echo "Step 2: Download semua file terbaru dari GitHub"

curl -o Code.js https://raw.githubusercontent.com/marthen-wq/kalkulator-analisa-pks/claude/palm-oil-factory-calculator-011CUmyoifh2G713pZ1RNFLv/phase2-deployment/Code.js
echo "✓ Code.js downloaded"

curl -o UI.html https://raw.githubusercontent.com/marthen-wq/kalkulator-analisa-pks/claude/palm-oil-factory-calculator-011CUmyoifh2G713pZ1RNFLv/phase2-deployment/UI.html
echo "✓ UI.html downloaded"

curl -o Summary.html https://raw.githubusercontent.com/marthen-wq/kalkulator-analisa-pks/claude/palm-oil-factory-calculator-011CUmyoifh2G713pZ1RNFLv/phase2-deployment/Summary.html
echo "✓ Summary.html downloaded"

curl -o Cashflow.html https://raw.githubusercontent.com/marthen-wq/kalkulator-analisa-pks/claude/palm-oil-factory-calculator-011CUmyoifh2G713pZ1RNFLv/phase2-deployment/Cashflow.html
echo "✓ Cashflow.html downloaded"

curl -o Styles.html https://raw.githubusercontent.com/marthen-wq/kalkulator-analisa-pks/claude/palm-oil-factory-calculator-011CUmyoifh2G713pZ1RNFLv/phase2-deployment/Styles.html
echo "✓ Styles.html downloaded"

curl -o Calculations.js https://raw.githubusercontent.com/marthen-wq/kalkulator-analisa-pks/claude/palm-oil-factory-calculator-011CUmyoifh2G713pZ1RNFLv/phase2-deployment/Calculations.js
echo "✓ Calculations.js downloaded"

curl -o DataManager.js https://raw.githubusercontent.com/marthen-wq/kalkulator-analisa-pks/claude/palm-oil-factory-calculator-011CUmyoifh2G713pZ1RNFLv/phase2-deployment/DataManager.js
echo "✓ DataManager.js downloaded"

curl -o Tests.js https://raw.githubusercontent.com/marthen-wq/kalkulator-analisa-pks/claude/palm-oil-factory-calculator-011CUmyoifh2G713pZ1RNFLv/phase2-deployment/Tests.js
echo "✓ Tests.js downloaded"

echo ""
echo "Step 3: Push ke Apps Script"
clasp push --force

echo ""
echo "==================================="
echo "DEPLOYMENT SELESAI!"
echo "==================================="
echo ""
echo "Langkah selanjutnya:"
echo "1. Buka browser"
echo "2. Tekan Cmd+Shift+R untuk hard refresh"
echo "3. Test aplikasi"
echo ""
