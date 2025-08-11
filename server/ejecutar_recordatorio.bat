@echo off
cd C:\laragon\www\GM-Estetica\server
C:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe artisan enviar:recordatorio-whatsapp
C:\laragon\bin\python\python-3.13\python.exe python_scripts\enviar_whatsapp.py