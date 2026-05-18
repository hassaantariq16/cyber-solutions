param(
  [Parameter(Mandatory=$true)]
  [string]$RegNo
)

$out = "${RegNo}.zip"
Write-Host "Creating clean submission $out..."

# Remove previous zip if exists
Remove-Item -ErrorAction Ignore $out

# Create temporary directory
$tempDir = Join-Path $PSScriptRoot $RegNo
if (Test-Path $tempDir) {
  Remove-Item -Recurse -Force $tempDir -ErrorAction Ignore
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# List of files and folders to copy
$itemsToCopy = @(
  "Dockerfile.frontend",
  "Dockerfile.db",
  "docker-compose.yml",
  "Report.pdf",
  "README.md",
  "README_DEVOPS.md",
  "package.json",
  "package-lock.json",
  "next.config.js",
  "tsconfig.json",
  "postcss.config.mjs",
  "next-env.d.ts",
  ".gitignore",
  ".dockerignore"
)

foreach ($item in $itemsToCopy) {
  if (Test-Path $item) {
    Copy-Item -Path $item -Destination (Join-Path $tempDir $item) -Force
  }
}

# List of directories to copy recursively
$dirsToCopy = @(
  "backend",
  "src",
  "public",
  "k8s",
  "tests",
  "screenshots",
  "docs",
  ".github"
)

foreach ($dir in $dirsToCopy) {
  if (Test-Path $dir) {
    $destDir = Join-Path $tempDir $dir
    Copy-Item -Path $dir -Destination $destDir -Recurse -Force
    
    # Exclude node_modules and cache from copied directories
    $excludePaths = @(
      (Join-Path $destDir "node_modules"),
      (Join-Path $destDir "selenium/node_modules"),
      (Join-Path $destDir ".next")
    )
    foreach ($exclude in $excludePaths) {
      if (Test-Path $exclude) {
        Remove-Item -Recurse -Force $exclude -ErrorAction Ignore
      }
    }
  }
}

# Compress the clean folder
Compress-Archive -Path $tempDir -DestinationPath $out -Force

# Clean up the temporary folder
Remove-Item -Recurse -Force $tempDir -ErrorAction Ignore

Write-Host "Clean submission $out created successfully!"
