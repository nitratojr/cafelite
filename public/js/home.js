// Executa o código somente após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Recupera o token e o usuário do armazenamento local (localStorage)
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Se não houver token, redireciona o usuário para a tela de login
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    // Seleciona todos os elementos do DOM que serão manipulados
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const origemFilter = document.getElementById('origemFilter');
    const tipoFilter = document.getElementById('tipoFilter');
    const torraFilter = document.getElementById('torraFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const addCafeBtn = document.getElementById('addCafeBtn');
    const listAllBtn = document.getElementById('listAllBtn');
    const cafesList = document.getElementById('cafesList');
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const cafeModal = document.getElementById('cafeModal');
    const cafeForm = document.getElementById('cafeForm');
    const modalTitle = document.getElementById('modalTitle');
    const closeModal = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const messageDiv = document.getElementById('message');
    
    // Armazena o ID do café que está sendo editado (se houver)
    let currentEditingId = null;
    
    // Exibe o nome do usuário na tela
    userName.textContent = `Bem-vindo, ${user.nome || 'Usuário'}!`;
    
    // Adiciona eventos aos botões
    logoutBtn.addEventListener('click', logout);
    searchBtn.addEventListener('click', performSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    applyFiltersBtn.addEventListener('click', applyFilters);
    addCafeBtn.addEventListener('click', openAddModal);
    listAllBtn.addEventListener('click', loadAllCafes);
    closeModal.addEventListener('click', closeModalHandler);
    cancelBtn.addEventListener('click', closeModalHandler);
    cafeForm.addEventListener('submit', saveCafe);
    
    // Permite buscar ao pressionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Fecha o modal se clicar fora da área do modal
    window.addEventListener('click', function(e) {
        if (e.target === cafeModal) {
            closeModalHandler();
        }
    });
    
    // Carrega todos os cafés ao abrir a página
    loadAllCafes();
    
    // Função para logout: limpa os dados e redireciona
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
    
    // Faz requisições com token incluso e tratamento de erro
    async function makeRequest(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        
        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, finalOptions);
            
            if (response.status === 401) {
                showMessage('Sessão expirada. Faça login novamente.', 'error');
                setTimeout(() => logout(), 2000);
                return null;
            }
            
            return response;
        } catch (error) {
            console.error('Erro na requisição:', error);
            showMessage('Erro de conexão. Tente novamente.', 'error');
            return null;
        }
    }
    
    // Carrega todos os cafés da API
    async function loadAllCafes() {
        showLoading(true);
        
        const response = await makeRequest('/coffees');
        if (!response) return;
        
        const data = await response.json();
        
        if (response.ok) {
            displayCafes(data.cafes);
        } else {
            showMessage(data.error || 'Erro ao carregar cafés', 'error');
        }
        
        showLoading(false);
    }
    
    // Realiza uma busca com base no texto digitado
    async function performSearch() {
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) {
            showMessage('Digite um termo para pesquisar', 'error');
            return;
        }
        
        showLoading(true);
        
        const response = await makeRequest(`/coffees/search?q=${encodeURIComponent(searchTerm)}`);
        if (!response) return;
        
        const data = await response.json();
        
        if (response.ok) {
            displayCafes(data.cafes);
            showMessage(`${data.total} café(s) encontrado(s) para "${data.searchTerm}"`, 'success');
        } else {
            showMessage(data.error || 'Erro na pesquisa', 'error');
        }
        
        showLoading(false);
    }
    
    // Limpa os campos de pesquisa e filtros
    function clearSearch() {
        searchInput.value = '';
        origemFilter.value = '';
        tipoFilter.value = '';
        torraFilter.value = '';
        loadAllCafes();
    }
    
    // Aplica filtros selecionados pelo usuário
    async function applyFilters() {
        const filters = new URLSearchParams();
        
        if (origemFilter.value) filters.append('origem', origemFilter.value);
        if (tipoFilter.value) filters.append('tipo', tipoFilter.value);
        if (torraFilter.value) filters.append('torra', torraFilter.value);
        
        if (filters.toString() === '') {
            showMessage('Selecione pelo menos um filtro', 'error');
            return;
        }
        
        showLoading(true);
        
        const response = await makeRequest(`/coffees/filter?${filters.toString()}`);
        if (!response) return;
        
        const data = await response.json();
        
        if (response.ok) {
            displayCafes(data.cafes);
            showMessage(`${data.total} café(s) encontrado(s) com os filtros aplicados`, 'success');
        } else {
            showMessage(data.error || 'Erro ao aplicar filtros', 'error');
        }
        
        showLoading(false);
    }

    // Exibe os cafés na tela em formato de cards
    function displayCafes(cafes) {
        if (!cafes || cafes.length === 0) {
            cafesList.innerHTML = '';
            emptyMessage.style.display = 'block';
            return;
        }
        
        emptyMessage.style.display = 'none';
        
        cafesList.innerHTML = cafes.map(cafe => `
            <div class="cafe-card">
                <h3>${cafe.nome}</h3>
                <div class="cafe-info">
                    <div class="cafe-info-item">
                        <strong>Origem</strong>
                        <span>${cafe.origem}</span>
                    </div>
                    <div class="cafe-info-item">
                        <strong>Tipo</strong>
                        <span>${cafe.tipo}</span>
                    </div>
                    <div class="cafe-info-item">
                        <strong>Torra</strong>
                        <span>${cafe.torra}</span>
                    </div>
                    <div class="cafe-info-item">
                        <strong>Aroma</strong>
                        <span>${cafe.aroma}</span>
                    </div>
                    <div class="cafe-info-item">
                        <strong>Sabor</strong>
                        <span>${cafe.sabor}</span>
                    </div>
                    <div class="cafe-info-item">
                        <strong>Estoque</strong>
                        <span>${cafe.quantidadeEstoque} unidades</span>
                    </div>
                </div>
                <div class="cafe-price">R$ ${parseFloat(cafe.preco).toFixed(2)}</div>
                <div class="cafe-actions">
                    <button class="btn btn-primary" onclick="editCafe('${cafe.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteCafe('${cafe.id}', '${cafe.nome}')">Excluir</button>
                </div>
            </div>
        `).join('');
    }
    
    // Exibe ou oculta a mensagem de carregamento
    function showLoading(show) {
        loadingMessage.style.display = show ? 'block' : 'none';
        if (show) {
            emptyMessage.style.display = 'none';
        }
    }
    
    // Abre o modal para adicionar novo café
    function openAddModal() {
        currentEditingId = null;
        modalTitle.textContent = 'Adicionar Café';
        cafeForm.reset();
        cafeModal.style.display = 'block';
    }
    
    // Carrega os dados de um café no modal para edição
    async function editCafe(id) {
        currentEditingId = id;
        modalTitle.textContent = 'Editar Café';
        
        const response = await makeRequest(`/coffees/${id}`);
        if (!response) return;
        
        const data = await response.json();
        
        if (response.ok) {
            const cafe = data.cafe;
            document.getElementById('cafeNome').value = cafe.nome;
            document.getElementById('cafeOrigem').value = cafe.origem;
            document.getElementById('cafeTipo').value = cafe.tipo;
            document.getElementById('cafeTorra').value = cafe.torra;
            document.getElementById('cafeAroma').value = cafe.aroma;
            document.getElementById('cafeSabor').value = cafe.sabor;
            document.getElementById('cafePreco').value = cafe.preco;
            document.getElementById('cafeQuantidade').value = cafe.quantidadeEstoque;
            
            cafeModal.style.display = 'block';
        } else {
            showMessage(data.error || 'Erro ao carregar café', 'error');
        }
    }
    
    // Exclui um café após confirmação
    async function deleteCafe(id, nome) {
        if (!confirm(`Tem certeza que deseja excluir o café "${nome}"?`)) {
            return;
        }
        
        const response = await makeRequest(`/coffees/${id}`, {
            method: 'DELETE'
        });
        
        if (!response) return;
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Café excluído com sucesso!', 'success');
            loadAllCafes();
        } else {
            showMessage(data.error || 'Erro ao excluir café', 'error');
        }
    }
    
    // Salva ou atualiza os dados do café preenchido no formulário
    async function saveCafe(e) {
        e.preventDefault();
        
        const formData = new FormData(cafeForm);
        const cafeData = {
            nome: formData.get('nome'),
            origem: formData.get('origem'),
            tipo: formData.get('tipo'),
            torra: formData.get('torra'),
            aroma: formData.get('aroma'),
            sabor: formData.get('sabor'),
            preco: parseFloat(formData.get('preco')),
            quantidadeEstoque: parseInt(formData.get('quantidadeEstoque'))
        };
        
        // Valida se todos os campos foram preenchidos corretamente
        if (!cafeData.nome || !cafeData.origem || !cafeData.tipo || !cafeData.torra || 
            !cafeData.aroma || !cafeData.sabor || isNaN(cafeData.preco) || isNaN(cafeData.quantidadeEstoque)) {
            showMessage('Por favor, preencha todos os campos corretamente.', 'error');
            return;
        }
        
        // Valida se os valores são positivos
        if (cafeData.preco < 0 || cafeData.quantidadeEstoque < 0) {
            showMessage('Preço e quantidade devem ser valores positivos.', 'error');
            return;
        }
        
        const isEditing = currentEditingId !== null;
        const url = isEditing ? `/coffees/${currentEditingId}` : '/coffees';
        const method = isEditing ? 'PUT' : 'POST';
        
        const response = await makeRequest(url, {
            method: method,
            body: JSON.stringify(cafeData)
        });
        
        if (!response) return;
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(`Café ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`, 'success');
            closeModalHandler();
            loadAllCafes();
        } else {
            showMessage(data.error || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} café`, 'error');
        }
    }
    
    // Fecha o modal e limpa o formulário
    function closeModalHandler() {
        cafeModal.style.display = 'none';
        cafeForm.reset();
        currentEditingId = null;
    }
    
    // Exibe mensagens de feedback para o usuário
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 4000);
    }
    
    // Torna funções globais para que possam ser usadas no HTML
    window.editCafe = editCafe;
    window.deleteCafe = deleteCafe;
});
