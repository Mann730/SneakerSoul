# SneakerSoul GitHub Upload Script
# This script will upload your project to GitHub
# Prerequisites: Git must be installed

Write-Host "🚀 SneakerSoul GitHub Upload Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "2. Install with default settings" -ForegroundColor Yellow
    Write-Host "3. Restart PowerShell" -ForegroundColor Yellow
    Write-Host "4. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OR use GitHub Desktop: https://desktop.github.com/" -ForegroundColor Yellow
    pause
    exit
}

# Navigate to project directory
Write-Host "📁 Navigating to project directory..." -ForegroundColor Cyan
Set-Location "c:\SneakerSoul"

# Initialize Git repository
Write-Host "🔧 Initializing Git repository..." -ForegroundColor Cyan
git init

# Configure Git user
Write-Host "👤 Configuring Git user..." -ForegroundColor Cyan
git config user.name "Mann730"
git config user.email "parmarmanav730@gmail.com"

# Add all files
Write-Host "📦 Adding files to Git..." -ForegroundColor Cyan
git add .

# Create commit
Write-Host "💾 Creating commit..." -ForegroundColor Cyan
git commit -m "Initial commit: SneakerSoul e-commerce platform"

# Add remote
Write-Host "🔗 Connecting to GitHub..." -ForegroundColor Cyan
git remote add origin https://github.com/Mann730/SneakerSoul.git

# Rename branch to main
Write-Host "🌿 Setting main branch..." -ForegroundColor Cyan
git branch -M main

# Push to GitHub
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "✅ SUCCESS! Your code is now on GitHub!" -ForegroundColor Green
Write-Host "🌐 View it at: https://github.com/Mann730/SneakerSoul" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Deploy frontend to Vercel: https://vercel.com/new" -ForegroundColor Yellow
Write-Host "2. Deploy backend to Render: https://dashboard.render.com/" -ForegroundColor Yellow
Write-Host ""
pause
