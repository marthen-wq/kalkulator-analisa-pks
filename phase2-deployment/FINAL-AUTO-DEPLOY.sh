#!/bin/bash

# ============================================
# KALKULATOR ANALISA PKS - FINAL AUTO DEPLOY
# ============================================
# Script ini akan:
# 1. Download SEMUA file terbaru dari GitHub
# 2. Backup file lama
# 3. Force push ke Apps Script
# 4. Create deployment baru
# ============================================

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   KALKULATOR ANALISA PKS - FINAL AUTO DEPLOYMENT      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Navigate to gas folder
cd /Users/martaen/gas || {
    echo "❌ ERROR: Folder /Users/martaen/gas tidak ditemukan!"
    exit 1
}

echo "✓ Current directory: $(pwd)"
echo ""

# Step 1: Backup existing files
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: Backup file lama..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup all JS and HTML files
if ls *.js *.html 2>/dev/null; then
    mv *.js *.html "$BACKUP_DIR/" 2>/dev/null || true
    echo "✓ File lama di-backup ke: $BACKUP_DIR"
else
    echo "✓ No files to backup"
fi
echo ""

# Step 2: Download all files from GitHub
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: Download SEMUA file terbaru dari GitHub..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BASE_URL="https://raw.githubusercontent.com/marthen-wq/kalkulator-analisa-pks/claude/palm-oil-factory-calculator-011CUmyoifh2G713pZ1RNFLv/phase2-deployment"

FILES=(
    "appsscript.json"
    "Code.js"
    "Calculations.js"
    "DataManager.js"
    "Tests.js"
    "Styles.html"
    "UI.html"
    "Summary.html"
    "Cashflow.html"
)

for file in "${FILES[@]}"; do
    echo -n "Downloading $file... "
    if curl -s -f -o "$file" "$BASE_URL/$file"; then
        echo "✓"
    else
        echo "❌ FAILED"
        exit 1
    fi
done

echo ""
echo "✓ Semua 9 file berhasil di-download"
echo ""

# Step 3: Verify files
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: Verify downloaded files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(ls -lh "$file" | awk '{print $5}')
        echo "✓ $file ($SIZE)"
    else
        echo "❌ $file MISSING"
        exit 1
    fi
done
echo ""

# Step 4: Push to Apps Script
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 4: Push ke Apps Script (force)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

clasp push --force

if [ $? -eq 0 ]; then
    echo "✓ Files berhasil di-push ke Apps Script"
else
    echo "❌ clasp push FAILED"
    exit 1
fi
echo ""

# Step 5: Create new deployment
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 5: Create deployment baru..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DEPLOY_DESC="Complete Fix - $(date '+%Y-%m-%d %H:%M:%S')"
DEPLOY_OUTPUT=$(clasp deploy -d "$DEPLOY_DESC" 2>&1)
DEPLOY_ID=$(echo "$DEPLOY_OUTPUT" | grep -o 'AKfyc[a-zA-Z0-9_-]*' | head -1)

if [ -z "$DEPLOY_ID" ]; then
    echo "❌ Failed to create deployment"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo "✓ Deployment created: $DEPLOY_ID"
echo ""

# Step 6: Show results
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DEPLOYMENT BERHASIL!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 DEPLOYMENT INFO:"
echo "   ID: $DEPLOY_ID"
echo ""
echo "🌐 WEB APP URL (COPY URL INI):"
echo ""
echo "   https://script.google.com/a/macros/garudasakti.co.id/s/$DEPLOY_ID/exec"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "LANGKAH SELANJUTNYA:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. COPY URL di atas"
echo "2. PASTE ke browser baru (atau Incognito: Cmd+Shift+N)"
echo "3. Jika muncul 'Request Access':"
echo "   - Klik 'Advanced'"
echo "   - Klik 'Go to Kalkulator Analisa PKS (unsafe)'"
echo "   - Klik 'Allow'"
echo "4. TEST aplikasi:"
echo "   ✓ Isi form → Hitung Analisa"
echo "   ✓ Lihat Summary (KPI, Charts, Tabel)"
echo "   ✓ Klik 'Lihat Cashflow 12 Bulan'"
echo "   ✓ Verify Cashflow page tampil dengan data"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Save URL to file for easy access
echo "https://script.google.com/a/macros/garudasakti.co.id/s/$DEPLOY_ID/exec" > ~/Desktop/WEB_APP_URL.txt
echo "✓ URL juga disimpan di: ~/Desktop/WEB_APP_URL.txt"
echo ""
