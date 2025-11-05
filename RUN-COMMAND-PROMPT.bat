@echo off
REM Run project from Command Prompt (CMD)

REM Navigate to project directory
cd /d "C:\Users\ROHIT KADAM\snippet-vault-keeper"

REM Set environment variable for npm to find node in child processes
set npm_config_scripts_prepend_node_path=true

REM Add Node.js to PATH for this session
set PATH=C:\Program Files\nodejs;%PATH%

REM Start the dev server
echo Starting development server...
"C:\Program Files\nodejs\npm.cmd" run dev

pause

