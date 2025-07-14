// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {

    // Seleciona o formulário de cadastro pelo ID
    const registerForm = document.getElementById('registerForm');

    // Seleciona a div onde as mensagens de feedback (sucesso, erro) serão exibidas
    const messageDiv = document.getElementById('message');

    // Verifica se o usuário já possui um token no localStorage (ou seja, está logado)
    const token = localStorage.getItem('token');

    if (token) {
        // Se estiver logado, redireciona para a página principal
        window.location.href = 'home.html';
        return; // Interrompe a execução
    }

    // Adiciona um evento ao formulário que é executado quando ele é enviado
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Impede o envio tradicional do formulário (recarregamento da página)

        // Captura os valores digitados nos campos do formulário
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Verificação se todos os campos foram preenchidos
        if (!nome || !email || !password) {
            showMessage('Por favor, preencha todos os campos.', 'error');
            return; // Encerra se faltar algum campo
        }

        // Verifica se a senha tem pelo menos 6 caracteres
        if (password.length < 6) {
            showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        // Verifica se o e-mail é válido com expressão regular (regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Por favor, insira um email válido.', 'error');
            return;
        }

        try {
            // Mostra uma mensagem temporária informando que está processando
            showMessage('Criando conta...', 'info');

            // Envia uma requisição POST para o endpoint /auth/register
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Define o tipo do corpo como JSON
                },
                body: JSON.stringify({ nome, email, password }) // Envia os dados do formulário como JSON
            });

            // Converte a resposta da API para JSON
            const data = await response.json();

            if (response.ok) {
                // Se a resposta for 200 OK ou 201 Created, exibe mensagem de sucesso
                showMessage('Conta criada com sucesso! Redirecionando para o login...', 'success');

                // Aguarda 2 segundos antes de redirecionar para a tela de login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                // Se a API retornou erro, exibe a mensagem vinda do backend ou uma genérica
                showMessage(data.error || 'Erro ao criar conta', 'error');
            }
        } catch (error) {
            // Se ocorrer algum erro de conexão ou inesperado, exibe erro genérico
            console.error('Erro:', error);
            showMessage('Erro de conexão. Tente novamente.', 'error');
        }
    });

    // Função que exibe uma mensagem no elemento <div id="message">
    function showMessage(message, type) {
        messageDiv.textContent = message; // Define o conteúdo do texto
        messageDiv.className = `message ${type}`; // Define a classe com base no tipo (sucesso, erro, etc.)
        messageDiv.style.display = 'block'; // Torna a mensagem visível

        // Se a mensagem for de sucesso ou informativa, esconde automaticamente depois de 3 segundos
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    }
});
