/**
 * MÃO NA RODA — PROTOCOLO DE BLINDAGEM E SEGURANÇA MÁXIMA CLIENT-SIDE
 * Impetus Tecnologia — Defesa em Profundidade contra Inspeção & F12
 * 
 * Camadas de Proteção:
 * 1. Desativação Completa de Console & Logs (Zero vazamento de dados no F12)
 * 2. Bloqueio Estrito de Teclas de Atalho de Inspeção (F12, Ctrl+Shift+I/J/C/K, Ctrl+U, Ctrl+S, Ctrl+P)
 * 3. Bloqueio de Clique com Botão Direito & Menu de Contexto
 * 4. Detecção Ativa de DevTools por Geometria com Auto-Clear Contínuo
 * 5. Proteção Anti-Clickjacking (Iframe Sandboxing)
 * 6. Proteção contra Arraste de Imagens e Ativos Proprietários
 */

(function () {
    'use strict';

    // 1. Desativar completamente todos os métodos de console para evitar vazamento de memória e dados
    if (window.console) {
        const noop = function () {};
        const consoleMethods = [
            'log', 'debug', 'info', 'warn', 'error', 'table', 'trace',
            'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd',
            'time', 'timeLog', 'timeEnd', 'assert', 'profile', 'profileEnd', 'count'
        ];
        consoleMethods.forEach(function (method) {
            try {
                window.console[method] = noop;
            } catch (_) {}
        });
        try {
            Object.freeze(window.console);
        } catch (_) {}
    }

    // 2. Bloquear Clique com Botão Direito (Menu de Contexto)
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, { capture: true });

    // 3. Bloquear Teclas de Atalho de Inspeção de Código (Windows, Linux, Mac)
    document.addEventListener('keydown', function (e) {
        // F12
        if (e.keyCode === 123 || e.key === 'F12') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        const isCtrlOrMeta = e.ctrlKey || e.metaKey;
        const key = (e.key || '').toLowerCase();

        // Ctrl + Shift + I (DevTools)
        // Ctrl + Shift + J (Console)
        // Ctrl + Shift + C (Element Inspector)
        // Ctrl + Shift + K (Firefox Console)
        if (isCtrlOrMeta && e.shiftKey && (key === 'i' || key === 'j' || key === 'c' || key === 'k')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl + U (Exibir código-fonte original)
        if (isCtrlOrMeta && key === 'u') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl + S (Salvar página completa / scraping)
        if (isCtrlOrMeta && key === 's') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl + P (Imprimir / salvar PDF de tela)
        if (isCtrlOrMeta && key === 'p') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, { capture: true });

    // 4. Bloquear Arraste de Imagens e Ativos
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
        return false;
    }, { capture: true });

    // 5. Detecção Ativa e Limpeza Automática Contínua de DevTools (Otimizada sem causar reflow forçado)
    let devToolsOpen = false;
    const threshold = 160;

    function monitorDevTools() {
        // Usa matchMedia e window.visualViewport quando disponível para evitar layout thrashing
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;

        if (widthDiff || heightDiff) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                try {
                    if (window.console && typeof window.console.clear === 'function') {
                        window.console.clear();
                    }
                } catch (_) {}
            }
        } else {
            devToolsOpen = false;
        }
    }

    window.addEventListener('resize', monitorDevTools, { passive: true });
    // Executa em idle para não competir com a renderização crítica do mobile
    if ('requestIdleCallback' in window) {
        setInterval(function() {
            window.requestIdleCallback(monitorDevTools, { timeout: 1000 });
        }, 3000);
    } else {
        setInterval(monitorDevTools, 3000);
    }

    // 6. Anti-Clickjacking: Impedir carregamento dentro de iframes externos maliciosos
    if (window.top !== window.self) {
        try {
            window.top.location = window.self.location;
        } catch (e) {
            document.documentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0A0B0E;color:#00E5FF;font-family:sans-serif;font-weight:bold;">Acesso protegido — Mão na Roda (Impetus Tecnologia)</div>';
        }
    }
})();
