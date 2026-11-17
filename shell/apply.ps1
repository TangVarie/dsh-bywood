# BYWOOD 桌面外壳补丁 · 一键脚本
#
# 插件（浏览器半）改不到的三处，靠这个脚本改安装目录里的 Electron 主进程：
#   - 托盘悬浮名称 / 右键菜单：DeepSeek Harness → 芭梧 BYWOOD
#   - 任务栏 hover 小窗（缩略图）图标：换成芭梧方标
#   - 退出确认框标题
#
# 同时把芭梧 tray.ico / icon.png 放进 resources/（原件先备份）。
# 只动 resources/app.asar、resources/tray.ico、resources/icon.png 三个文件；app.asar 是同位改写
# （字节数、偏移都不变），所以应用正在运行也能装，重启生效。加 -Restore 回滚。

param(
  [string]$AppDir = '',
  [switch]$Restore,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$exeName = 'DeepSeek Harness.exe'
$applyScript = Join-Path $PSScriptRoot 'apply.mjs'

function Test-AppDir([string]$Dir) {
  if ([string]::IsNullOrWhiteSpace($Dir)) { return $false }
  return (Test-Path -LiteralPath (Join-Path $Dir 'resources\app.asar')) -and (Test-Path -LiteralPath (Join-Path $Dir $exeName))
}

# 找安装目录：参数 → 环境变量 → 卸载注册表 → 常见路径 → 开始菜单快捷方式
function Find-AppDir {
  if (Test-AppDir $AppDir) { return $AppDir }

  if ($env:DSH_NODE_EXECUTABLE -and (Test-Path -LiteralPath $env:DSH_NODE_EXECUTABLE)) {
    $candidate = Split-Path -Parent $env:DSH_NODE_EXECUTABLE
    if (Test-AppDir $candidate) { return $candidate }
  }

  $uninstallRoots = @(
    'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall',
    'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall',
    'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall'
  )
  foreach ($root in $uninstallRoots) {
    $entries = Get-ChildItem -Path $root -ErrorAction SilentlyContinue
    foreach ($entry in $entries) {
      $props = Get-ItemProperty -Path $entry.PSPath -ErrorAction SilentlyContinue
      if ($props -and $props.DisplayName -like 'DeepSeek Harness*' -and (Test-AppDir $props.InstallLocation)) {
        return $props.InstallLocation
      }
    }
  }

  $candidates = @()
  if ($env:LOCALAPPDATA) { $candidates += (Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness') }
  if ($env:ProgramFiles) { $candidates += (Join-Path $env:ProgramFiles 'DeepSeek Harness') }
  if (${env:ProgramFiles(x86)}) { $candidates += (Join-Path ${env:ProgramFiles(x86)} 'DeepSeek Harness') }
  foreach ($candidate in $candidates) { if (Test-AppDir $candidate) { return $candidate } }

  try {
    $wsh = New-Object -ComObject WScript.Shell
    $shortcutRoots = @()
    if ($env:APPDATA) { $shortcutRoots += (Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs') }
    if ($env:ProgramData) { $shortcutRoots += (Join-Path $env:ProgramData 'Microsoft\Windows\Start Menu\Programs') }
    foreach ($root in $shortcutRoots) {
      $links = Get-ChildItem -Path $root -Filter '*DeepSeek*.lnk' -Recurse -ErrorAction SilentlyContinue
      foreach ($link in $links) {
        $target = $wsh.CreateShortcut($link.FullName).TargetPath
        if ($target) {
          $candidate = Split-Path -Parent $target
          if (Test-AppDir $candidate) { return $candidate }
        }
      }
    }
  } catch {
    # 没有 COM / 没有快捷方式都无所谓，继续往下走
  }

  return ''
}

$resolved = Find-AppDir
if (-not $resolved) {
  Write-Host '找不到 DeepSeek Harness 的安装目录。' -ForegroundColor Yellow
  Write-Host '请手动指定，例如：'
  Write-Host '  powershell -ExecutionPolicy Bypass -File apply.ps1 -AppDir "D:\deepseek harness"'
  exit 1
}
$resolved = (Resolve-Path -LiteralPath $resolved).Path
$appExe = Join-Path $resolved $exeName
if (-not (Test-Path -LiteralPath $applyScript)) { throw "缺少脚本：$applyScript" }

$applyArgs = @('--app', $resolved)
if ($Restore) { $applyArgs += '--restore' }
if ($DryRun) { $applyArgs += '--dry-run' }

# 选 runner：优先系统 node（控制台程序，退出码可靠），没有再借应用自带的 Electron 当 node
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
  & $nodeCommand.Source $applyScript @applyArgs
  exit $LASTEXITCODE
}

# 没有 node：把应用本体当 node 用（ELECTRON_RUN_AS_NODE）。用 Process.Start 而不是
# Start-Process：后者在部分环境里拿不到子进程的 ExitCode（会抛 Access is denied）。
$env:ELECTRON_RUN_AS_NODE = '1'
$env:ELECTRON_NO_ASAR = '1'
Write-Host '运行：应用自带的 Electron（node 模式）'
$argumentLine = (@("`"$applyScript`"") + ($applyArgs | ForEach-Object { if ($_ -like '-*') { $_ } else { "`"$_`"" } })) -join ' '
$startInfo = New-Object System.Diagnostics.ProcessStartInfo
$startInfo.FileName = $appExe
$startInfo.Arguments = $argumentLine
$startInfo.UseShellExecute = $false
$startInfo.WorkingDirectory = $resolved
$process = [System.Diagnostics.Process]::Start($startInfo)
$process.WaitForExit()
exit $process.ExitCode
