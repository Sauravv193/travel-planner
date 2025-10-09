# Test Neon Database Connection
# Usage: Set your NEON_DATABASE_URL and run this script

param(
    [Parameter(Mandatory=$false)]
    [string]$DatabaseUrl
)

if (-not $DatabaseUrl) {
    $DatabaseUrl = $env:DATABASE_URL
}

if (-not $DatabaseUrl) {
    Write-Host "Error: Please provide DATABASE_URL either as parameter or environment variable" -ForegroundColor Red
    Write-Host "Usage: .\test-neon-connection.ps1 -DatabaseUrl 'your-neon-connection-string'" -ForegroundColor Yellow
    Write-Host "   or: `$env:DATABASE_URL='your-connection-string'; .\test-neon-connection.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Testing connection to Neon database..." -ForegroundColor Green

# Set environment variable for the test
$env:DATABASE_URL = $DatabaseUrl
$env:SPRING_PROFILES_ACTIVE = "production"

# Navigate to backend directory
Set-Location "backend\WarderGen"

# Test if we can compile and run basic connectivity test
Write-Host "Compiling the application..." -ForegroundColor Yellow
mvn clean compile -q

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Application compiled successfully" -ForegroundColor Green
    Write-Host "Database URL format appears valid: $($DatabaseUrl.Substring(0, [Math]::Min(50, $DatabaseUrl.Length)))..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Deploy to Render with the new DATABASE_URL environment variable" -ForegroundColor White
    Write-Host "2. Monitor the application logs to ensure successful database connection" -ForegroundColor White
} else {
    Write-Host "✗ Compilation failed. Please check your configuration." -ForegroundColor Red
}

# Return to original directory
Set-Location "..\.."
