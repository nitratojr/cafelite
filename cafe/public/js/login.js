// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // Captura o formulário de login e a div onde serão exibidas mensagens
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    // Verifica se o usuário já está autenticado (token no localStorage)
    const token = localStorage.getItem('token');
    if (token) {
        // Se estiver logado, redireciona para a página principal
        window.location.href = 'home.html';
        return; // Encerra a execução
    }

    // Adiciona evento de envio ao formulário de login
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Evita o recarregamento padrão do formulário

        // Obtém os valores dos campos de e-mail e senha
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validação simples: campos obrigatórios
        if (!email || !password) {
            showMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }

        try {
            // Exibe mensagem de carregamento
            showMessage('Fazendo login...', 'info');

            // Envia requisição POST para autenticação
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Envia email e senha no corpo da requisição
                body: JSON.stringify({ email, password })
            });

            // Converte a resposta da API em JSON
            const data = await response.json();

            if (response.ok) {
                // Login bem-sucedido

                // Armazena o token JWT e os dados do usuário localmente
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Exibe mensagem de sucesso e redireciona
                showMessage('Login realizado com sucesso! Redirecionando...', 'success');

                // Espera 1.5 segundos antes de redirecionar para a home
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                // Exibe mensagem de erro da API ou uma mensagem padrão
                showMessage(data.error || 'Erro ao fazer login', 'error');
            }
        } catch (error) {
            // Trata erros de rede ou conexão
            console.error('Erro:', error);
            showMessage('Erro de conexão. Tente novamente.', 'error');
        }
    });

    // Função para exibir mensagens na tela
    function showMessage(message, type) {
        messageDiv.textContent = message; // Define o texto da mensagem
        messageDiv.className = `message ${type}`; // Define a classe com o tipo (success, error, info)
        messageDiv.style.display = 'block'; // Torna a mensagem visível

        // Oculta automaticamente a mensagem depois de alguns segundos (somente para success/info)
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    }
});
