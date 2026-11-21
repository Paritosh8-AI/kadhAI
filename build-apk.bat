@echo off
echo ========================================================
echo        kadhAI Production Android APK Builder
echo ========================================================
echo.
echo [1/3] Building Web Production Assets...
cd frontend
call npm run build
echo.
echo [2/3] Syncing Capacitor Native Android Project...
call npx cap sync android
echo.
echo [3/3] Checking for Java / Gradle...
where java >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Java detected! Building APK with Gradle...
    cd android
    call gradlew.bat assembleDebug
    echo.
    echo ========================================================
    echo SUCCESS! APK Generated at:
    echo frontend\android\app\build\outputs\apk\debug\app-debug.apk
    echo ========================================================
    cd ..\..
) else (
    echo Note: Java is not in your system PATH.
    echo Opening in Android Studio where you can click "Build -> Build APK"...
    call npx cap open android
    cd ..
)
pause
