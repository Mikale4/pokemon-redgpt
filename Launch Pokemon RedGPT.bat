@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 run_game.py
  exit /b
)
where python >nul 2>nul
if %errorlevel%==0 (
  python run_game.py
  exit /b
)
start "Pokemon RedGPT" "%~dp0index.html"
echo Python was not found. The game was opened directly in your browser.
pause
