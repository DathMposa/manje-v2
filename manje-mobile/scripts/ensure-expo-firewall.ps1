$ports = @(8081, 8082, 19000, 19001, 19002)
$profiles = 'Private,Public'

foreach ($port in $ports) {
  try {
    $ruleName = "Manje Expo TCP $port"
    $existingRule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue

    if ($existingRule) {
      Write-Host "Firewall rule already present for TCP port $port"
      continue
    }

    if (-not $existingRule) {
      New-NetFirewallRule `
        -DisplayName $ruleName `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort $port `
        -Profile $profiles `
        -ErrorAction Stop | Out-Null
      Write-Host "Created firewall rule for TCP port $port"
    }
  } catch {
    Write-Warning "Could not create or update the firewall rule for port $port. Run PowerShell as Administrator once, then run 'npm run network:fix'."
    break
  }
}

$listeners = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in $ports } |
  Sort-Object LocalPort |
  Select-Object LocalAddress, LocalPort, OwningProcess

if ($listeners) {
  Write-Host ''
  Write-Host 'Active listeners on Expo ports:'
  $listeners | Format-Table -AutoSize
}
