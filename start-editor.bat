@echo off
chcp 65001 >nul
cd /d "%~dp0"
"C:\Users\wuerl\.workbuddy\binaries\node\versions\22.22.2\node.exe" server.js
pause
