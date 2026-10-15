/**
 * MÃO NA RODA — PROTOCOLO DE BLINDAGEM E PROTEÇÃO DE CÓDIGO
 * Impetus Tecnologia — Segurança Avançada Client-Side
 * 
 * Protege contra:
 * - Abertura de DevTools e inspeção de código (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S)
 * - Clique com botão direito (contextmenu)
 * - Impressão ou vazamento de logs no console do navegador
 * - Tentativas de engenharia reversa e raspagem de dados
 * - Clickjacking (embedding em iframes não autorizados)
 */

(function () {
    'use strict';

    // 1. Desativar logs do console em produção para evitar vazamento de dados
    if (window.console) {
        const noop = function () {};
        const methods = ['log', 'debug', 'info', 'warn', 'table', 'trace'];
        methods.forEach(m => {
            window.console[m] = noop;
        });
    }

    // 2. Bloquear Clique com Botão Direito
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    }, { capture: true });

    // 3. Bloquear Teclas de Atalho de Inspeção de Código
    document.addEventListener('keydown', function (e) {
        // F12
        if (e.keyCode === 123 || e.key === 'F12') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl + Shift + I (DevTools)
        // Ctrl + Shift + J (Console)
        // Ctrl + Shift + C (Element Inspector)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl + U (Exibir código-fonte)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl + S (Salvar página completa)
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, { capture: true });

    // 4. Detecção Ativa de DevTools Abertos com Interrupção Preventiva
    let devToolsOpen = false;
    const threshold = 160;

    function detectDevTools() {
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;

        if (widthDiff || heightDiff) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                if (window.console && window.console.clear) {
                    window.console.clear();
                }
            }
        } else {
            devToolsOpen = false;
        }
    }

    window.addEventListener('resize', detectDevTools);
    setInterval(detectDevTools, 1500);

    // 5. Anti-Clickjacking: Impedir carregamento dentro de iframes externos
    if (window.top !== window.self) {
        try {
            window.top.location = window.self.location;
        } catch (e) {
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0A0B0E;color:#00E5FF;font-family:sans-serif;font-weight:bold;">Acesso protegido — Mão na Roda</div>';
        }
    }

})();
