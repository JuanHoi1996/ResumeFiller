@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0pack-edge-store.ps1"
if errorlevel 1 pause
