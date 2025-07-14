# 📘 Sistema de Café - Projeto Completo

Sistema web completo para gerenciamento de cafés com autenticação e CRUD, desenvolvido com **Node.js**, **TypeScript**, **TypeORM** e **MySQL**.

## 🎯 Funcionalidades

### ✅ Autenticação
- Cadastro de usuários com validação
- Login com JWT (JSON Web Token)
- Hash de senhas com bcryptjs


### ✅ CRUD de Cafés
- **Criar**: Adicionar novos cafés com todos os detalhes
- **Listar**: Visualizar todos os cafés cadastrados
- **Buscar**: Pesquisar cafés por ID específico
- **Pesquisar**: Busca por nome, origem, tipo, etc.
- **Filtrar**: Filtros por origem, tipo e torra
- **Editar**: Atualizar informações dos cafés
- **Deletar**: Remover cafés do sistema

### ✅ Interface Web
- Tela de login responsiva
- Tela de cadastro de usuários
- Dashboard principal com todas as funcionalidades
- Design moderno com tema café
- Feedback visual para todas as ações

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **TypeORM** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **CORS** - Política de origem cruzada

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização responsiva
- **JavaScript** - Interatividade e comunicação com API

## 📁 Estrutura do Projeto

```
sistema-cafe/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuração do TypeORM
│   ├── controllers/
│   │   ├── AuthController.ts    # Controlador de autenticação
│   │   └── CafeController.ts    # Controlador de cafés
│   ├── models/
│   │   ├── User.ts              # Entidade de usuário
│   │   └── Cafe.ts              # Entidade de café
│   ├── routes/
│   │   ├── auth.ts              # Rotas de autenticação
│   │   └── coffees.ts           # Rotas de cafés
│   |
├── public/
│   ├── index.html               # Página de login
│   ├── cadastro.html            # Página de cadastro
│   ├── home.html                # Dashboard principal
│   ├── css/
│   │   └── style.css            # Estilos principais
│   └── js/
│       ├── login.js             # Lógica de login
│       ├── cadastro.js          # Lógica de cadastro
│       └── home.js              # Lógica do dashboard
├── .env                         # Variáveis de ambiente
|
└── package.json                 # Dependências do projeto
```

## 🚀 Como Executar

### 1. Pré-requisitos
- **Node.js** (versão 16 ou superior)
- **MySQL Server** e **MySQL Workbench**
- **Git** (para clonar o projeto)

### 2. Configurar o Banco de Dados
1. Abra o **MySQL Workbench**
2. crie um novo banco de dados com o nome `sistema-cafe`
3. Configure as credenciais no arquivo `.env`

### 3. Instalar Dependências
```bash
cd sistema-cafe
npm install
```

### 4. Configurar Variáveis de Ambiente
Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=nome_usuario
DB_PASSWORD=senha_usuario
DB_DATABASE=sistema_cafe
JWT_SECRET=seu_jwt_secret_muito_seguro
PORT=3000
```

### 5. Executar o Projeto
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

### 6. Acessar o Sistema
Abra o navegador e acesse: `http://localhost:3000`

## 📊 Banco de Dados

### Tabela `user`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| email | VARCHAR | Email único do usuário |
| nome | VARCHAR | Nome do usuário |
| password | VARCHAR | Senha hasheada |
| createdAt | TIMESTAMP | Data de criação |
| updatedAt | TIMESTAMP | Data de atualização |

### Tabela `cafe`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | VARCHAR | Nome do café |
| origem | VARCHAR | País/região de origem |
| tipo | VARCHAR | Grãos, Moído ou Cápsula |
| torra | VARCHAR | Clara, Média ou Escura |
| aroma | VARCHAR | Perfil aromático |
| sabor | VARCHAR | Perfil de sabor |
| preco | DECIMAL | Preço em reais |
| quantidadeEstoque | INT | Quantidade em estoque |
| createdAt | TIMESTAMP | Data de criação |
| updatedAt | TIMESTAMP | Data de atualização |

## 🔗 API Endpoints

### Autenticação
- `POST /auth/register` - Cadastrar usuário
- `POST /auth/login` - Fazer login

### Cafés (Requer autenticação)
- `POST /coffees` - Criar café
- `GET /coffees` - Listar todos os cafés
- `GET /coffees/search?q=termo` - Pesquisar cafés
- `GET /coffees/filter?origem=Brasil&tipo=Grãos` - Filtrar cafés
- `GET /coffees/:id` - Buscar café por ID
- `PUT /coffees/:id` - Atualizar café
- `DELETE /coffees/:id` - Deletar café

## 🎨 Características do Design

- **Tema Café**: Cores inspiradas em tons de café e marrom
- **Responsivo**: Funciona em desktop e mobile
- **Moderno**: Interface limpa e intuitiva
- **Interativo**: Hover effects e transições suaves
- **Feedback Visual**: Mensagens de sucesso e erro
- **Cards**: Layout em grid para exibição dos cafés

## 🔒 Segurança

- Senhas hasheadas com bcryptjs
- Autenticação JWT com expiração
- Validação de dados no backend
- Proteção contra SQL injection (TypeORM)
- CORS configurado para segurança

## 📱 Funcionalidades da Interface

### Tela de Login
- Validação de campos obrigatórios
- Feedback de erro para credenciais inválidas
- Redirecionamento automático após login

### Tela de Cadastro
- Validação de email e senha
- Verificação de senha mínima (6 caracteres)
- Prevenção de emails duplicados

### Dashboard Principal
- Barra de pesquisa em tempo real
- Filtros por origem, tipo e torra
- Modal para adicionar/editar cafés
- Confirmação antes de deletar
- Cards responsivos para cada café

## 🧪 Testes

O sistema foi desenvolvido seguindo boas práticas e inclui:
- Validações no frontend e backend
- Tratamento de erros
- Feedback visual para o usuário
- Responsividade testada

## 📝 Scripts Disponíveis

```bash
npm run dev      # Executa em modo desenvolvimento
npm run build    # Compila o TypeScript
npm start        # Executa a versão compilada
npm test         # Executa testes (a implementar)
```

## 🤝 Contribuição

Este projeto foi desenvolvido como atividade avaliativa seguindo os requisitos especificados:

- ✅ Backend em Node.js com TypeScript
- ✅ ORM TypeORM com MySQL
- ✅ Autenticação completa
- ✅ CRUD completo da entidade Café
- ✅ Frontend em HTML/CSS/JS puro
- ✅ Validações e feedback visual
- ✅ Estrutura de pastas organizada

## 📄 Licença

Este projeto é para fins educacionais e avaliativos.

---

**Desenvolvido com ☕ e muito carinho!**

