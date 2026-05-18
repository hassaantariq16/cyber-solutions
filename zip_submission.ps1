param(
  [Parameter(Mandatory=$true)]
  [string]$RegNo
)

$out = "${RegNo}.zip"
Write-Host "Creating submission $out"
Remove-Item -ErrorAction Ignore $out
Compress-Archive -Path * -DestinationPath $out -Force
Write-Host "Created $out"
