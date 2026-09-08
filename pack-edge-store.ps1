# Pack a Microsoft Edge Add-ons ZIP (runtime only; manifest.json at archive root).
# Usage:  .\pack-edge-store.ps1
# Output: ..\ResumeFiller-<version>-edge.zip  (sibling of this repo folder)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$manifestPath = Join-Path $root "manifest.json"
if (-not (Test-Path $manifestPath)) {
  throw "manifest.json not found: $manifestPath"
}

$manifest = Get-Content -Raw -Encoding UTF8 $manifestPath | ConvertFrom-Json
$version = [string]$manifest.version
if (-not $version) { throw "manifest.json has no version" }

$outDir = Split-Path -Parent $root
$zipName = "ResumeFiller-$version-edge.zip"
$zipPath = Join-Path $outDir $zipName

$stage = Join-Path ([System.IO.Path]::GetTempPath()) ("ResumeFiller-edge-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $stage | Out-Null

$files = @(
  "manifest.json",
  "background.js",
  "content.js",
  "popup.html",
  "popup.js",
  "editor.html",
  "editor.js",
  "privacy.html",
  "storage.js",
  "data.js"
)

try {
  foreach ($rel in $files) {
    $src = Join-Path $root $rel
    if (-not (Test-Path $src)) { throw "Missing runtime file: $rel" }
    Copy-Item -LiteralPath $src -Destination (Join-Path $stage $rel)
  }

  $iconStage = Join-Path $stage "icons\active"
  New-Item -ItemType Directory -Path $iconStage -Force | Out-Null
  foreach ($size in 16, 32, 48, 128) {
    $icon = Join-Path $root "icons\active\icon$size.png"
    if (-not (Test-Path $icon)) { throw "Missing icon: icons\active\icon$size.png" }
    Copy-Item -LiteralPath $icon -Destination (Join-Path $iconStage "icon$size.png")
  }

  if (Test-Path $zipPath) { Remove-Item -LiteralPath $zipPath -Force }

  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [System.IO.Compression.ZipFile]::CreateFromDirectory(
    $stage,
    $zipPath,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
  )

  $entries = @()
  $archive = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
  try {
    $entries = @($archive.Entries | ForEach-Object { $_.FullName.Replace("\", "/") })
  } finally {
    $archive.Dispose()
  }

  if ($entries -notcontains "manifest.json") {
    throw "ZIP root is wrong: manifest.json is not at archive root."
  }
  if ($entries | Where-Object { $_ -match '(^|/)(tests/|\.git/|CHANGELOG|\.md$)' }) {
    throw "ZIP contains docs/tests/.git — aborting."
  }

  Write-Host "Packed $zipName"
  Write-Host "  version : $version"
  Write-Host "  files   : $($entries.Count)"
  Write-Host "  path    : $zipPath"
  Write-Host "Upload this ZIP at Partner Center -> Packages. Store tile logo300.png is NOT inside the ZIP; upload it on the listing page if needed."
}
finally {
  if (Test-Path $stage) { Remove-Item -LiteralPath $stage -Recurse -Force }
}
