@echo off
title MapReview Pay - Live Internet Tunnel
echo ========================================================
echo  Publishing MapReview Pay to the Public Internet...
echo  (Your Laptop is now acting as a Live Global Server)
echo ========================================================
echo.
echo Make sure your server is running (port 3000).
echo Generating Live Public URL...
echo.
npx localtunnel --port 3000
pause
