"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./config/database"));
const auth_1 = __importDefault(require("./routes/auth"));
const coffees_1 = __importDefault(require("./routes/coffees"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3000');
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Rotas da API
app.use('/auth', auth_1.default);
app.use('/coffees', coffees_1.default);
// Rota para servir o frontend
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
// Inicializar banco de dados e servidor
database_1.default.initialize()
    .then(() => {
    console.log('Banco de dados conectado com sucesso!');
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Acesse: http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
});
