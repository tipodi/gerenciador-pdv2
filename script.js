document.addEventListener('DOMContentLoaded', function() {
    // Dados de exemplo (substituir por dados reais)
    let pdvs = ['PDV 1', 'PDV 2', 'PDV 3', 'PDV 4', 'PDV 5', 'PDV 6', 'PDV 7', 'PDV 8', 'PDV 9', 'PDV 10'];
    let operadores = ['Operador A', 'Operador B', 'Operador C'];
    let alocacoes = {}; // { PDV: Operador }
    let pdvsInativos = [];
    let gruposTurno = []; // Array para armazenar os grupos de turno

    // Elementos da página
    const listaPdvsPendentes = document.getElementById('lista-pdvs-pendentes');
    const listaOperadoresDisponiveis = document.getElementById('lista-operadores-disponiveis');
    const gradeAlocacao = document.getElementById('grade-alocacao');
    const adicionarOperadorButton = document.getElementById('adicionar-operador');
    const removerOperadorButton = document.getElementById('remover-operador');
    const criarGrupoTurnoButton = document.getElementById('criar-grupo-turno');
    const alocarAutomaticamenteButton = document.getElementById('alocar-automaticamente'); // Novo botão
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.querySelector('.close');
    const listaPdvsVazios = document.getElementById('lista-pdvs-vazios'); // Nova lista
    const listaOperadoresSemPdv = document.getElementById('lista-operadores-sem-pdv'); // Nova lista
    const listaGruposTurno = document.getElementById('lista-grupos-turno');
    const loginModal = document.getElementById('loginModal');
    const loginButton = document.getElementById('loginButton');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginMessage = document.getElementById('loginMessage');
    const alterarSenhaButton = document.getElementById('alterarSenhaButton');
    const exportToExcelButton = document.getElementById('export-to-excel'); // Botão de exportar para Excel
    const loginGearButton = document.getElementById('login-gear-button');
    const loginArea = document.getElementById('login-area');

    let loggedIn = false;

    // Users data
    const users = {
        'lucas': '123',
        'igor': '123'
    };

    // Funções para atualizar a interface
    function atualizarListaPdvsPendentes() {
        listaPdvsPendentes.innerHTML = '';
        const pdvsAlocados = Object.keys(alocacoes);
        const pdvsPendentes = pdvs.filter(pdv => !pdvsAlocados.includes(pdv));

        pdvsPendentes.forEach(pdv => {
            const li = document.createElement('li');
            li.textContent = pdv;
             li.addEventListener('click', () => {
                togglePDVInativo(pdv);
            });
            if (pdvsInativos.includes(pdv)) {
                li.classList.add('inativo');
            } else {
                 li.classList.remove('inativo');
            }
            listaPdvsPendentes.appendChild(li);
        });
        atualizarListasVazias(); // Atualiza as novas listas
    }

    function atualizarListaOperadoresDisponiveis() {
        listaOperadoresDisponiveis.innerHTML = '';
        const operadoresAlocados = Object.values(alocacoes);
        const operadoresDisponiveis = operadores.filter(operador => !operadoresAlocados.includes(operador));

        operadoresDisponiveis.forEach(operador => {
            const li = document.createElement('li');
            li.innerHTML = `${operador} <button class="remover-operador-inline" data-operador="${operador}">Remover</button>`;
            listaOperadoresDisponiveis.appendChild(li);
        });

        // Adiciona event listeners aos botões de remoção inline
        document.querySelectorAll('.remover-operador-inline').forEach(button => {
            button.addEventListener('click', function(event) {
                const operador = this.dataset.operador;
                removerOperador(operador);
                event.stopPropagation(); // Impede que o evento de clique se propague para o li
            });
        });
         atualizarListasVazias(); // Atualiza as novas listas
    }

    function atualizarGradeAlocacao() {
        gradeAlocacao.innerHTML = '';
        pdvs.forEach(pdv => {
            const div = document.createElement('div');
            div.classList.add('pdv');
            div.textContent = pdv;

            if (alocacoes[pdv]) {
                div.textContent = `${pdv} - ${alocacoes[pdv]}`;
            }

            gradeAlocacao.appendChild(div);
        });
         atualizarListasVazias(); // Atualiza as novas listas
    }

   function togglePDVInativo(pdv) {
        const index = pdvsInativos.indexOf(pdv);
        if (index > -1) {
            pdvsInativos.splice(index, 1); // Remove se já estiver inativo
        } else {
            pdvsInativos.push(pdv); // Adiciona se estiver ativo
        }
        atualizarListaPdvsPendentes();
    }

    // Funções para manipulação de dados (simuladas)
    function adicionarOperador(nome) {
        operadores.push(nome);
        atualizarListaOperadoresDisponiveis();
    }

    function removerOperador(nome) {
        operadores = operadores.filter(operador => operador !== nome);
        // Remove alocações que incluem o operador removido
         for (const pdv in alocacoes) {
            if (alocacoes[pdv] === nome) {
                delete alocacoes[pdv];
            }
        }
        atualizarListaOperadoresDisponiveis();
        atualizarListaPdvsPendentes();
        atualizarGradeAlocacao();
    }

    // Função para alocação automática
    function alocarAutomaticamente() {
        // Limpa alocações existentes
        alocacoes = {};

        // Cria cópias dos arrays para manipulação
        let pdvsDisponiveis = [...pdvs].filter(pdv => !pdvsInativos.includes(pdv));
        let operadoresDisponiveis = [...operadores];

        // Aloca operadores a PDVs até que não haja mais PDVs ou operadores disponíveis
        while (pdvsDisponiveis.length > 0 && operadoresDisponiveis.length > 0) {
            const pdvIndex = Math.floor(Math.random() * pdvsDisponiveis.length);
            const operadorIndex = Math.floor(Math.random() * operadoresDisponiveis.length);

            const pdv = pdvsDisponiveis[pdvIndex];
            const operador = operadoresDisponiveis[operadorIndex];

            alocacoes[pdv] = operador;

            // Remove os PDVs e operadores alocados das listas de disponíveis
            pdvsDisponiveis.splice(pdvIndex, 1);
            operadoresDisponiveis.splice(operadorIndex, 1);
        }

        // Atualiza a interface
        atualizarListaPdvsPendentes();
        atualizarListaOperadoresDisponiveis();
        atualizarGradeAlocacao();
    }

    // Atualiza as listas de PDVs vazios e Operadores sem PDV
    function atualizarListasVazias() {
        // PDVs vazios
        listaPdvsVazios.innerHTML = '';
        const pdvsAlocados = Object.keys(alocacoes);
        const pdvsVazios = pdvs.filter(pdv => !pdvsAlocados.includes(pdv) && !pdvsInativos.includes(pdv));
        pdvsVazios.forEach(pdv => {
            const li = document.createElement('li');
            li.textContent = pdv;
            listaPdvsVazios.appendChild(li);
        });

        // Operadores sem PDV
        listaOperadoresSemPdv.innerHTML = '';
        const operadoresAlocados = Object.values(alocacoes);
        const operadoresSemPdv = operadores.filter(operador => !operadoresAlocados.includes(operador));
        operadoresSemPdv.forEach(operador => {
            const li = document.createElement('li');
            li.textContent = operador;
            listaOperadoresSemPdv.appendChild(li);
        });
    }

    // Modais
    function openModal(content) {
        modalBody.innerHTML = content;
        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    // Função para atualizar lista de grupos de turno
    function atualizarListaGruposTurno() {
        listaGruposTurno.innerHTML = '';
        gruposTurno.forEach(grupo => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${grupo.nome}:</strong> ${grupo.operadores.join(', ')}`;
            listaGruposTurno.appendChild(li);
        });
    }

    // Login Functionality
    function checkLogin(username, password) {
        if (users[username] === password) {
            loggedIn = true;
            return true;
        }
        return false;
    }

    function updateUIForLoginState() {
        if (loggedIn) {
            loginModal.style.display = 'none';
        } else {
            loginModal.style.display = 'block';
        }
    }

    loginGearButton.addEventListener('click', function() {
        loginArea.classList.toggle('expanded');
    });

    loginButton.addEventListener('click', function() {
        const username = loginUsernameInput.value;
        const password = loginPasswordInput.value;

        if (checkLogin(username, password)) {
            loginMessage.textContent = 'Login realizado com sucesso.';
            loginMessage.style.color = 'green';
            updateUIForLoginState();
        } else {
            loginMessage.textContent = 'Login falhou. Verifique seu nome de usuário e senha.';
            loginMessage.style.color = 'red';
        }
    });

    alterarSenhaButton.addEventListener('click', function() {
        openModal(`
            <h3>Alterar Senha</h3>
            <input type="text" id="alterarUsername" placeholder="Username">
            <input type="password" id="alterarPasswordAtual" placeholder="Senha Atual">
            <input type="password" id="alterarPasswordNova" placeholder="Nova Senha">
            <button id="salvarNovaSenha">Salvar Nova Senha</button>
        `);

        document.getElementById('salvarNovaSenha').addEventListener('click', function() {
            const username = document.getElementById('alterarUsername').value;
            const passwordAtual = document.getElementById('alterarPasswordAtual').value;
            const passwordNova = document.getElementById('alterarPasswordNova').value;

            if (users[username] === passwordAtual) {
                users[username] = passwordNova;
                alert('Senha alterada com sucesso!');
            } else {
                alert('Falha ao alterar a senha. Verifique seu nome de usuário e senha atual.');
            }
            closeModal();
        });
    });

    // Event listeners dos botões
    adicionarOperadorButton.addEventListener('click', function() {
        openModal(`
            <input type="text" id="nome-operador" placeholder="Nome do Operador">
            <button id="salvar-operador">Salvar</button>
        `);

        document.getElementById('salvar-operador').addEventListener('click', function() {
            const nomeOperador = document.getElementById('nome-operador').value;
            adicionarOperador(nomeOperador);
            closeModal();
        });
    });

    removerOperadorButton.addEventListener('click', function() {
         let options = '';
        operadores.forEach(operador => {
            options += `<option value="${operador}">${operador}</option>`;
        });

        openModal(`
            <select id="nome-operador-remover">
                ${options}
            </select>
            <button id="remover">Remover</button>
        `);

        document.getElementById('remover').addEventListener('click', function() {
            const nomeOperador = document.getElementById('nome-operador-remover').value;
            removerOperador(nomeOperador);
            closeModal();
        });
    });

   criarGrupoTurnoButton.addEventListener('click', function() {
        openModal(`
            <h3>Criar Grupo de Turno</h3>
            <input type="text" id="nome-grupo-turno" placeholder="Nome do Grupo">
            <h4>Selecione os Operadores:</h4>
            <div id="operadores-selecionaveis">
                ${operadores.map(operador => `
                    <label>
                        <input type="checkbox" name="operador" value="${operador}">
                        ${operador}
                    </label><br>
                `).join('')}
            </div>
            <button id="salvar-grupo-turno">Salvar Grupo</button>
        `);

        document.getElementById('salvar-grupo-turno').addEventListener('click', function() {
            const nomeGrupo = document.getElementById('nome-grupo-turno').value;
            const operadoresSelecionados = Array.from(document.querySelectorAll('input[name="operador"]:checked'))
                .map(checkbox => checkbox.value);

            if (nomeGrupo && operadoresSelecionados.length > 0) {
                gruposTurno.push({ nome: nomeGrupo, operadores: operadoresSelecionados });
                atualizarListaGruposTurno();
            } else {
                alert('Por favor, insira um nome para o grupo e selecione pelo menos um operador.');
            }
            closeModal();
        });
    });

    alocarAutomaticamenteButton.addEventListener('click', alocarAutomaticamente); // Evento do novo botão

    modalClose.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Show login modal on page load
    updateUIForLoginState();

    // Inicialização
    atualizarListaPdvsPendentes();
    atualizarListaOperadoresDisponiveis();
    atualizarGradeAlocacao();
    atualizarListasVazias();
});