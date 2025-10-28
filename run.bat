@echo off
REM Fix PATH and run project

REM Set current directory
cd /d "C:\Users\ROHIT KADAM\snippet-vault-keeper"

REM Set environment variable for npm to find node in child processes
set npm_config_scripts_prepend_node_path=true

REM Add Node.js to PATH for this session
set "PATH=C:\Program Files\nodejs;%PATH%"

REM Clean and reinstall if needed
if not exist "node_modules" (
    echo Installing dependencies...
    "C:\Program Files\nodejs\npm.cmd" install --no-audit --no-fund
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies. Please check if Node.js is installed at C:\Program Files\nodejs
        pause
        exit /b 1
    )
)

REM Start the dev server
echo Starting development server...
"C:\Program Files\nodejs\npm.cmd" run dev

