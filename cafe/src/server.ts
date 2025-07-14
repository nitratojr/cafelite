import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth';
import coffeeRoutes from './routes/coffees';

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use('/auth', authRoutes);
app.use('/coffees', coffeeRoutes);

// Rota para servir o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Inicializar banco de dados e servidor
AppDataSource.initialize()
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

