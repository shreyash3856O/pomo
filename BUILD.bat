@echo off
echo ====================================
echo   Pomogranate Timer - Builder
echo ====================================
echo.

:: Check Node.js
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org
    echo Then run this script again.
    pause
    exit /b 1
)

echo [1/3] Installing dependencies...
call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed.
    pause
    exit /b 1
)

echo.
echo [2/3] Building Pomogranate.exe...
call npm run build
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed.
    pause
    exit /b 1
)

echo.
echo [3/3] Done!
echo.
echo Your Pomogranate.exe is in the "dist" folder!
echo Double-click it to run - no install needed.
echo.
pause
