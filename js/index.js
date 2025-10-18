// js/index.js

document.addEventListener('DOMContentLoaded', () => {


    // =================================================================
    // NOVO: BLOQUEIO DE AÇÕES DO NAVEGADOR
    // =================================================================

    // Bloqueia o menu de contexto (botão direito do mouse) em toda a página.
    // Isso impede o acesso ao "Inspecionar", "Google Lens", etc.
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        alert("Ação bloqueada para manter o foco no desafio!");
    });

    // Bloqueia as ações de copiar, colar e recortar.
    ['cut', 'copy', 'paste'].forEach(event => {
        document.addEventListener(event, (e) => {
            e.preventDefault();
            alert("Copiar e colar estão desativados para este desafio.");
        });
    });

    // Bloqueia as teclas de atalho (Ctrl+C, Ctrl+V, Ctrl+U, F12, etc.)
    document.addEventListener('keydown', (event) => {
        // Bloqueia F12 (ferramentas de desenvolvedor)
        
        if (event.key === 'F12' || event.keyCode === 123) {
            event.preventDefault();
            alert("Ação bloqueada.");
            return;
        }

        // Bloqueia Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (outras formas de abrir dev tools)
        if (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key.toUpperCase())) {
            event.preventDefault();
            alert("Ação bloqueada.");
            return;
        }

        // Bloqueia Ctrl+U (ver código-fonte)
        if (event.ctrlKey && event.key.toUpperCase() === 'U') {
            event.preventDefault();
            alert("Ação bloqueada.");
            return;
        }
    });
    // =================================================================
    // 1. SELEÇÃO DE ELEMENTOS (APENAS OS QUE EXISTEM NO index.html)
    // =================================================================
    const historiaElement = document.getElementById('texto-historia');
    const cadastroContainer = document.getElementById('cadastro-container');
    const cadastroForm = document.getElementById('cadastro-form');
    const groupNameInput = document.getElementById('group-name-input');
    const errorMessage = document.getElementById('error-message'); // Corrigido: Estava faltando este seletor

    // =================================================================
    // 2. LÓGICA DE ANIMAÇÃO E CURSOR
    // =================================================================
    const textoHistoria = `Na Escola Jardim Iguatemi tudo parecia normal até que, numa manhã de segunda-feira, os sistemas da escola entraram em colapso. A rede caiu, os computadores travaram e uma mensagem enigmática apareceu em todas as tela dos computadores:\n\n“O saber foi selado. Decifrem o enigma ou permaneçam na ignorância. — Grupo Sombra”\n\nA diretoria De ensino ficou em choque. Sem acesso aos dados , avaliações e sistemas de segurança, a escola estava paralisada. A diretora Andrea e a Laura que responsável pelos equipamentos da escola pensaram sobre o problema e decidiram agir. Ela convocou os alunos do Cursos técnicos com habilidades excepcionais em tecnologia, investigação e lógica.`;

    // A função typeWriter e o setInterval do cursor continuam os mesmos
    function typeWriter(element, text, speed, callback) { let i = 0; function type() { if (i < text.length) { element.innerHTML = text.substring(0, i + 1); i++; setTimeout(type, speed); } else if (callback) { callback(); } } type(); }

    function mostrarCadastro() {
        cadastroContainer.classList.remove('hidden');
    }

    // Inicia a digitação da história principal
    typeWriter(historiaElement, textoHistoria, 30, mostrarCadastro);

    // =================================================================
    // 3. LÓGICA DE CADASTRO E VALIDAÇÃO (ÚNICO addEventListener)
    // =================================================================
    cadastroForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nomeDoGrupo = groupNameInput.value.trim();
        errorMessage.textContent = ''; // Limpa erros anteriores

        if (!nomeDoGrupo) return;

        // 1. Pega o ranking salvo no LocalStorage, ou cria um array vazio se não existir.
        let ranking = JSON.parse(localStorage.getItem('escolaIguatemiRanking')) || [];

        // 2. Verifica se o nome do grupo já existe (ignorando maiúsculas/minúsculas)
        const nomeExistente = ranking.find(grupo => grupo.nome.toLowerCase() === nomeDoGrupo.toLowerCase());

        if (nomeExistente) {
            // 3. Se o nome existe, mostra um erro e não continua.
            errorMessage.textContent = 'Este nome de grupo já existe. Por favor, escolha outro.';
        } else {
            // 4. Se o nome é único, salva o grupo atual e redireciona.
            // Limpa o progresso de desafios anteriores para o novo grupo começar do zero.
            localStorage.removeItem('desafio1_completo');
            localStorage.removeItem('desafio2_completo');
            localStorage.removeItem('desafio3_completo');

            localStorage.removeItem('desafio1_tentativas');
            localStorage.removeItem('desafio2_tentativas');
            localStorage.removeItem('desafio3_tentativas');

            localStorage.removeItem('desafio1_falhou');
            localStorage.removeItem('desafio2_falhou');
            localStorage.removeItem('desafio3_falhou');

            // Salva o nome do grupo atual para ser usado na próxima página
            localStorage.setItem('grupoAtual', nomeDoGrupo);

            // Redireciona para a página de desafio
            window.location.href = 'desafio.html';
        }
    });
});

