// js/desafio.js

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
        if (event.ctrlKey && event.shiftKey && ['J', 'C'].includes(event.key.toUpperCase())) {
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
    // 1. SELEÇÃO DE ELEMENTOS
    // =================================================================
    const nomeDoGrupo = localStorage.getItem('grupoAtual') || 'Anônimo';
    const welcomeContainer = document.getElementById('welcome-container');
    const textoBoasVindasElement = document.getElementById('texto-boas-vindas');
    const roteiroContainer = document.getElementById('roteiro-container');
    const challengesMasterContainer = document.getElementById('challenges-master-container');
    const successContainer = document.getElementById('success-container');
    const successOutput = document.getElementById('success-output');
    const rankingContainer = document.getElementById('ranking-container');
    const rankingTableContainer = document.getElementById('ranking-table');
    const roteiroSpans = {
        1: document.querySelector('#roteiro-1 span'),
        2: document.querySelector('#roteiro-2 span'),
        3: document.querySelector('#roteiro-3 span'),
    };
    const challenge1Container = document.getElementById('challenge-1-container');
    const quizForm = document.getElementById('quiz-form');
    const quizFeedback = document.getElementById('quiz-feedback');
    const challenge2Container = document.getElementById('challenge-2-container');
    const codeInput2 = document.getElementById('code-input-2');
    const runButton2 = document.getElementById('run-button-2');
    const outputArea2 = document.getElementById('output-area-2');
    const challenge3Container = document.getElementById('challenge-3-container');
    const codeInput3 = document.getElementById('code-input-3');
    const runButton3 = document.getElementById('run-button-3');
    const outputArea3 = document.getElementById('output-area-3');

    // =================================================================
    // 2. ESTADO DO JOGO
    // =================================================================
    const challengeStatus = {
        1: { completo: localStorage.getItem('desafio1_completo') === 'true', falhou: localStorage.getItem('desafio1_falhou') === 'true' },
        2: { completo: localStorage.getItem('desafio2_completo') === 'true', falhou: localStorage.getItem('desafio2_falhou') === 'true' },
        3: { completo: localStorage.getItem('desafio3_completo') === 'true', falhou: localStorage.getItem('desafio3_falhou') === 'true' },
    };

    // =================================================================
    // 3. FUNÇÕES DE LÓGICA E INTERFACE (UI)
    // =================================================================
    function adicionarPontos(pontos) {
        let ranking = JSON.parse(localStorage.getItem('escolaIguatemiRanking')) || [];
        let grupoAtual = ranking.find(g => g.nome === nomeDoGrupo);
        if (grupoAtual) {
            grupoAtual.pontuacao += pontos;
        } else {
            ranking.push({ nome: nomeDoGrupo, pontuacao: pontos });
        }
        localStorage.setItem('escolaIguatemiRanking', JSON.stringify(ranking));
    }

    function updateRoteiro() {
        for (const id in challengeStatus) {
            if (challengeStatus[id].completo) {
                roteiroSpans[id].textContent = challengeStatus[id].falhou ? '❌' : '🔑';
            } else {
                roteiroSpans[id].textContent = '🔒';
            }
        }
    }

    function displayCurrentChallenge() {
        challenge1Container.classList.add('hidden');
        challenge2Container.classList.add('hidden');
        challenge3Container.classList.add('hidden');

        if (!challengeStatus[1].completo) {
            challenge1Container.classList.remove('hidden');
        } else if (!challengeStatus[2].completo) {
            challenge2Container.classList.remove('hidden');
        } else if (!challengeStatus[3].completo) {
            challenge3Container.classList.remove('hidden');
        } else {
            showFinalVictory();
        }
    }

    function showFinalVictory() {
        welcomeContainer.classList.add('hidden');
        roteiroContainer.classList.add('hidden');
        challengesMasterContainer.classList.add('hidden');

        const saidaDeSucesso = `SISTEMA TOTALMENTE RESTAURADO!\n\n` +
                               `MISSÃO CUMPRIDA!\n\n` +
                               `PARABÉNS, EQUIPE ${nomeDoGrupo}!`;
        successOutput.textContent = saidaDeSucesso;
        successContainer.classList.remove('hidden');

        setTimeout(() => {
            displayRanking();
            rankingContainer.classList.remove('hidden');
            const finalButtonsHTML = `
                <div class="final-actions">
                    <a href="index.html" class="restart-button">Voltar para o Início</a>
                    <button id="reset-ranking-button" class="reset-button hidden">Zerar Ranking</button>
                </div>
            `;
            // Adiciona os botões ao final do success-container
            successContainer.insertAdjacentHTML('beforeend', finalButtonsHTML);
        }, 2000);
    }

    function displayRanking() {
        const ranking = JSON.parse(localStorage.getItem('escolaIguatemiRanking')) || [];
        ranking.sort((a, b) => b.pontuacao - a.pontuacao);
        let tableHTML = `<table class="ranking"><thead><tr><th>Posição</th><th>Grupo</th><th>Pontuação</th></tr></thead><tbody>`;
        ranking.forEach((grupo, index) => {
            tableHTML += `<tr><td>${index + 1}º</td><td>${grupo.nome}</td><td>${grupo.pontuacao}</td></tr>`;
        });
        tableHTML += `</tbody></table>`;
        rankingTableContainer.innerHTML = tableHTML;
    }

    // =================================================================
    // NOVO: ADICIONE ESTE EVENT LISTENER NO ESCOPO PRINCIPAL
    // =================================================================
    // Usamos event delegation porque o botão #reset-ranking-button não existe quando a página carrega.
    successContainer.addEventListener('click', (event) => {
        // Verifica se o elemento clicado é o nosso botão de zerar
        if (event.target.id === 'reset-ranking-button') {
            
            // Pede confirmação para evitar cliques acidentais
            if (confirm("Você tem certeza que deseja apagar o ranking de TODOS os grupos? Esta ação não pode ser desfeita.")) {
                // Remove a chave do ranking do localStorage
                localStorage.removeItem('escolaIguatemiRanking');
                
                alert("Ranking zerado com sucesso!");
                
                // Recarrega a página para que a tabela do ranking desapareça
                location.reload();
            }
        }
    });

    function typeWriter(element, text, speed, callback) { let i = 0; function type() { if (i < text.length) { element.innerHTML = text.substring(0, i + 1); i++; setTimeout(type, speed); } else if (callback) { callback(); } } type(); }

    // =================================================================
    // 4. LÓGICA DE VALIDAÇÃO DOS DESAFIOS
    // =================================================================
    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let tentativas = parseInt(localStorage.getItem('desafio1_tentativas')) || 0;
        tentativas++;
        const answers = { q1: quizForm.elements.q1.value, q2: quizForm.elements.q2.value, q3: quizForm.elements.q3.value, q4: quizForm.elements.q4.value };
        const correctAnswers = { q1: 'V', q2: 'F', q3: 'V', q4: 'F' };

        if (answers.q1 === correctAnswers.q1 && answers.q2 === correctAnswers.q2 && answers.q3 === correctAnswers.q3 && answers.q4 === correctAnswers.q4) {
            if (localStorage.getItem('desafio1_completo') !== 'true') {
                adicionarPontos(150);
            }
            localStorage.setItem('desafio1_completo', 'true');
            challengeStatus[1].completo = true; // CORRIGIDO
            quizFeedback.textContent = "Correto! Chave do Desafio 1 obtida.";
            quizFeedback.style.color = '#00ff00';
            setTimeout(() => {
                updateRoteiro();
                displayCurrentChallenge();
            }, 1500);
        } else {
            quizFeedback.style.color = '#ff4136';
            if (tentativas >= 2) {
                quizFeedback.textContent = "Tentativas esgotadas. Avançando para o próximo desafio sem pontuar.";
                adicionarPontos(0);
                localStorage.setItem('desafio1_completo', 'true');
                localStorage.setItem('desafio1_falhou', 'true');
                challengeStatus[1].completo = true;
                challengeStatus[1].falhou = true;
                setTimeout(() => {
                    updateRoteiro();
                    displayCurrentChallenge();
                }, 2000);
            } else {
                quizFeedback.textContent = "Incorreto. Revise suas respostas. Você tem mais 1 tentativa.";
                adicionarPontos(0);
                
            }
        }
        localStorage.setItem('desafio1_tentativas', tentativas);
    });

    runButton2.addEventListener('click', () => {
        let tentativas = parseInt(localStorage.getItem('desafio2_tentativas')) || 0;
        tentativas++;
        const userCode = codeInput2.value.replace(/\s+/g, '').replace(/"/g, "'");
        const answer1 = "df.loc[df['Sales']==300]";
        const answer2 = "df[df['Sales']==300]";

        if (userCode.includes(answer1) || userCode.includes(answer2)) {
            if (localStorage.getItem('desafio2_completo') !== 'true') {
                adicionarPontos(150);
            }
            outputArea2.textContent = "Código correto! Chave do Desafio 2 obtida.";
            outputArea2.style.color = '#00ff00';
            localStorage.setItem('desafio2_completo', 'true');
            challengeStatus[2].completo = true;
            setTimeout(() => {
                updateRoteiro();
                displayCurrentChallenge();
            }, 1500);
        } else {
            outputArea2.style.color = '#ff4136';
            if (tentativas >= 2) {
                outputArea2.textContent = "Tentativas esgotadas. Avançando para o próximo desafio sem pontuar.";
                adicionarPontos(0);
                localStorage.setItem('desafio2_completo', 'true');
                localStorage.setItem('desafio2_falhou', 'true');
                challengeStatus[2].completo = true;
                challengeStatus[2].falhou = true;
                setTimeout(() => {
                    updateRoteiro();
                    displayCurrentChallenge();
                }, 2000);
            } else {
                outputArea2.textContent = "Código incorreto. Você tem mais 1 tentativa.";
                adicionarPontos(0);
            }
        }
        localStorage.setItem('desafio2_tentativas', tentativas);
    });

    runButton3.addEventListener('click', () => {
        let tentativas = parseInt(localStorage.getItem('desafio3_tentativas')) || 0;
        tentativas++;
        const userCode = codeInput3.value;
        const chamada1 = "user123.exibir_dado_protegido()";
        const chamada2 = "user123.descobrir_senha()";
        const codigoLimpo = userCode.replace(/\s+/g, '');

        if (codigoLimpo.includes(chamada1) && codigoLimpo.includes(chamada2)) {
            if (localStorage.getItem('desafio3_completo') !== 'true') {
                adicionarPontos(150);
            }
            outputArea3.textContent = "Criptografia quebrada! Chave final obtida!";
            outputArea3.style.color = '#00ff00';
            localStorage.setItem('desafio3_completo', 'true');
            // CORRIGIDO: Removido o salvamento incorreto do status de falha
            challengeStatus[3].completo = true;
            challengeStatus[3].falhou = false; // Garante que não seja marcado como falha
            localStorage.removeItem('desafio3_falhou'); // Remove a chave de falha se existir
            setTimeout(() => {
                updateRoteiro();
                displayCurrentChallenge();
            }, 1500);
        } else {
            outputArea3.style.color = '#ff4136';
            if (tentativas >= 2) {
                outputArea3.textContent = "Tentativas esgotadas. Desafio finalizado sem pontuar.";
                adicionarPontos(0);
                localStorage.setItem('desafio3_completo', 'true');
                localStorage.setItem('desafio3_falhou', 'true'); // CORRIGIDO: Adicionado o salvamento de falha aqui
                challengeStatus[3].completo = true;
                challengeStatus[3].falhou = true;
                setTimeout(() => {
                    updateRoteiro();
                    displayCurrentChallenge();
                }, 2000);
            } else {
                outputArea3.textContent = "Incorreto. Invoque os métodos na ordem correta. Você tem mais 1 tentativa.";
                adicionarPontos(0);
            }
        }
        localStorage.setItem('desafio3_tentativas', tentativas);
    });

    // =================================================================
    // 5. INICIALIZAÇÃO
    // =================================================================
    const textoBoasVindas = `Muito bem, ${nomeDoGrupo}. 
    Vocês foram escolhidos. A restauração do saber depende de vocês. Sua jornada começa agora...`;

    typeWriter(textoBoasVindasElement, textoBoasVindas, 40, () => {
        roteiroContainer.classList.remove('hidden');
        challengesMasterContainer.classList.remove('hidden');
        updateRoteiro();
        displayCurrentChallenge();
    });
});