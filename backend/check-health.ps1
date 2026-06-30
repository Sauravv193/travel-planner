try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/health' -UseBasicParsing -TimeoutSec 10
    Write-Host "Status:" $r.StatusCode
    Write-Host "Content:" $r.Content
} catch {
    Write-Host "Error:" $_.Exception.Message
}
