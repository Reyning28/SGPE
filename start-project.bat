@echo off
echo ========================================
echo    SGPE - Sistema de Gestion
echo ========================================
echo.
echo Iniciando servicios...
echo.

REM Iniciar el backend en una nueva ventana
start "SGPE Backend" cmd /k "cd backend && npm start"

REM Esperar un momento para que el backend se inicie
timeout /t 3 /nobreak > nul

REM Iniciar el frontend en una nueva ventana
start "SGPE Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo    Servicios iniciados correctamente
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:8080 (o puerto disponible)
echo.
echo Credenciales de acceso:
echo Email: admin@sgpe.com
echo Password: admin123
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause > nul

REM Abrir el navegador
start http://localhost:8080

echo.
echo ¡Proyecto SGPE iniciado exitosamente!
echo.
pause 