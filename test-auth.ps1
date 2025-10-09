# Test Authentication Script for Travel Planner Backend
$baseUrl = "https://travel-planner-backend-qaym.onrender.com"

Write-Host "Testing Travel Planner Backend Authentication..." -ForegroundColor Green
Write-Host "Base URL: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Test Health Endpoint
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET -TimeoutSec 30
    Write-Host "✅ Health Check - Status: $($healthResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($healthResponse.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Debug Password Encoding Endpoint
Write-Host "2. Testing Debug Password Encoding..." -ForegroundColor Cyan
try {
    $debugResponse = Invoke-WebRequest -Uri "$baseUrl/api/debug/encode-password?password=testpass123" -Method POST -TimeoutSec 30
    Write-Host "✅ Debug Encoding - Status: $($debugResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($debugResponse.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Debug Encoding Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Signup (if you want to create a test user)
Write-Host "3. Testing User Signup..." -ForegroundColor Cyan
$signupData = @{
    username = "testuser$(Get-Random -Minimum 100 -Maximum 999)"
    email = "test$(Get-Random -Minimum 100 -Maximum 999)@example.com"
    password = "testpass123"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/signup" -Method POST -Body $signupData -ContentType "application/json" -TimeoutSec 30
    Write-Host "✅ Signup - Status: $($signupResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($signupResponse.Content)" -ForegroundColor White
    
    # Extract username for login test
    $signupResponseObj = $signupData | ConvertFrom-Json
    $testUsername = $signupResponseObj.username
    $testPassword = $signupResponseObj.password
    
    Write-Host ""
    Write-Host "4. Testing User Signin with new account..." -ForegroundColor Cyan
    
    $signinData = @{
        username = $testUsername
        password = $testPassword
    } | ConvertTo-Json
    
    try {
        $signinResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/signin" -Method POST -Body $signinData -ContentType "application/json" -TimeoutSec 30
        Write-Host "✅ Signin - Status: $($signinResponse.StatusCode)" -ForegroundColor Green
        Write-Host "Response: $($signinResponse.Content)" -ForegroundColor White
        Write-Host ""
        Write-Host "🎉 Authentication is working correctly!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Signin Failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Testing Debug Password Check..." -ForegroundColor Cyan
        try {
            $debugTestResponse = Invoke-WebRequest -Uri "$baseUrl/api/debug/test-password?username=$testUsername&password=$testPassword" -Method POST -TimeoutSec 30
            Write-Host "Debug Password Test Response: $($debugTestResponse.Content)" -ForegroundColor Yellow
        } catch {
            Write-Host "❌ Debug Password Test Failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "❌ Signup Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test completed." -ForegroundColor Green