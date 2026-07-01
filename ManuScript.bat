@echo off
:: Configura la codifica dei caratteri in UTF-8 per supportare caratteri speciali
chcp 65001 >nul
setlocal enabledelayedexpansion

title Caricamento Allegati (Files e Links) - Git Sync

echo =======================================================
echo    Sincronizzazione e Caricamento File/Link su Git
echo =======================================================
echo.

:: 1. Verifica che Git sia installato
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRORE] Git non e' installato o non e' presente nel PATH di sistema.
    echo Installa Git da https://git-scm.com/ e riprova.
    goto FINE
)

:: 2. Posizionamento nella cartella dello script (root del progetto)
cd /d "%~dp0"

:: Verifica che sia presente la cartella .git
if not exist .git (
    echo [ERRORE] Questo script deve essere eseguito nella cartella principale del progetto ^(dove e' presente la cartella .git^).
    goto FINE
)

:: 3. Rilevamento automatico del branch corrente (es. main)
set BRANCH=main
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set BRANCH=%%i

echo Rilevato branch corrente: %BRANCH%
echo Verifica dello stato del server in corso...
git fetch origin

:: 4. Controllo configurazione nome ed email Git (per evitare errori di commit)
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Configurazione nome Git mancante. Imposto nome predefinito locale...
    git config --local user.name "Collega Softmaint"
)

git config user.email >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Configurazione email Git mancante. Imposto email predefinita locale...
    git config --local user.email "collega@softmaint.it"
)

:: 5. Aggiunta dei file nelle cartelle public/files/ e public/links/
echo.
echo Preparazione dei file in public/files/ e public/links/...
git add "public/files/" "public/links/"

:: 6. Verifica se ci sono modifiche effettive da committare
git diff --cached --quiet "public/files/" "public/links/"
if %errorlevel% equ 0 (
    echo.
    echo [INFO] Nessun nuovo file o link rilevato da caricare.
    echo Procedo comunque con il controllo degli aggiornamenti sul server...
    goto PULL_PUSH
)

:: 7. Creazione del commit locale con timestamp
echo Creazione del commit con i nuovi file/link...
set TIMESTAMP=%DATE% %TIME%
set COMMIT_MSG=Aggiunti/aggiornati files e links il %TIMESTAMP%

git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo [ERRORE] Impossibile creare il commit locale.
    goto FINE
)

:PULL_PUSH
:: 8. Sincronizzazione con il server (pull con rebase e autostash)
:: Questo permette di scaricare le ultime modifiche del codice senza creare conflitti e
:: mettendo le modifiche del collega "in cima" alla cronologia.
echo.
echo Sincronizzazione con il server (Ricezione nuovi dati)...
git pull --rebase --autostash origin %BRANCH%
if %errorlevel% neq 0 (
    echo.
    echo [ERRORE] Si e' verificato un problema durante la sincronizzazione.
    echo Se ci sono conflitti, potrebbe essere necessario l'intervento del programmatore.
    goto FINE
)

:: 9. Invio delle modifiche sul server (push)
echo.
echo Invio delle modifiche sul server (Invio dati)...
git push origin %BRANCH%
if %errorlevel% neq 0 (
    echo.
    echo [ERRORE] Caricamento non riuscito. Controlla la connessione internet o i permessi di accesso.
    goto FINE
)

echo.
echo =======================================================
echo   [SUCCESSO] File e Link caricati e allineati!
echo =======================================================

:FINE
echo.
echo Premi un tasto per uscire...
pause >nul
