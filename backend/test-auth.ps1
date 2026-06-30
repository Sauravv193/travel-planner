Write-Host "=== Testing Sign Up ===" -ForegroundColor Green
try {
    $body = @{
        username = "testuser123"
        email = "testuser123@example.com"
        password = "TestPass123!"
    } | ConvertTo-Json
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/auth/signup' -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10
    Write-Host "Status:" $r.StatusCode -ForegroundColor Yellow
    Write-Host "Response:" $r.Content -ForegroundColor Cyan
} catch {
    Write-Host "Sign Up Error:" $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body:" $reader.ReadToEnd() -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Testing Sign In ===" -ForegroundColor Green
try {
    $body = @{
        username = "testuser123"
        password = "TestPass123!"
    } | ConvertTo-Json
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/auth/signin' -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10
    Write-Host "Status:" $r.StatusCode -ForegroundColor Yellow
    Write-Host "Response:" $r.Content -ForegroundColor Cyan
} catch {
    Write-Host "Sign In Error:" $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body:" $reader.ReadToEnd() -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Testing Token Refresh ===" -ForegroundColor Green
try {
    $body = @{
        username = "testuser123"
        password = "TestPass123!"
    } | ConvertTo-Json
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/auth/signin' -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10
    $authResponse = $r.Content | ConvertFrom-Json
    Write-Host "Got token from signin, now testing refresh..." -ForegroundColor Yellow
    
    $body2 = @{
        refreshToken = $authResponse.refreshToken
    } | ConvertTo-Json
    $r2 = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/auth/refreshtoken' -Method Post -Body $body2 -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10
    Write-Host "Refresh Status:" $r2.StatusCode -ForegroundColor Yellow
    Write-Host "Refresh Response:" $r2.Content -ForegroundColor Cyan
} catch {
    Write-Host "Refresh Error:" $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body:" $reader.ReadToEnd() -ForegroundColor Red
    }
}
