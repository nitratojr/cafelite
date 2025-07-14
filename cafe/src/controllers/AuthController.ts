// Importa os tipos do Express para definir os parâmetros de requisição e resposta
import { Request, Response } from 'express';
// Importa a fonte de dados configurada (conexão com o banco)
import { AppDataSource } from '../config/database';
// Importa a entidade User (modelo da tabela de usuários)
import { User } from '../models/User';
// Importa o bcryptjs para criptografar e comparar senhas
import bcrypt from 'bcryptjs';
// Importa a biblioteca JWT para geração e validação de tokens
import jwt from 'jsonwebtoken';

// Cria o repositório que será usado para acessar a tabela de usuários
const userRepository = AppDataSource.getRepository(User);

// Função auxiliar para remover o campo "password" ao retornar dados do usuário
const omitPassword = (user: User) => {
  const { password, ...rest } = user;
  return rest; // Retorna todos os dados do usuário, exceto a senha
};

// Classe que representa o controller de autenticação
export class AuthController {

  // ===============================
  // Cadastrar novo usuário (register)
  // ===============================
  async register(req: Request, res: Response) {
    const { email, nome, password } = req.body;

    // Verifica se todos os campos obrigatórios foram enviados
    if (!email || !nome || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Garante que a senha tenha no mínimo 6 caracteres
    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    try {
      // Verifica se já existe um usuário com o mesmo email
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Criptografa a senha usando bcrypt com 10 rounds de salt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria o usuário com os dados recebidos e a senha já criptografada
      const user = userRepository.create({ email, nome, password: hashedPassword });

      // Salva o novo usuário no banco de dados
      await userRepository.save(user);

      // Retorna mensagem de sucesso e os dados do usuário (sem a senha)
      res.status(201).json({
        message: 'Usuário cadastrado com sucesso',
        user: omitPassword(user)
      });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // ===============================
  // Login de usuário (login)
  // ===============================
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    // Valida se os campos foram preenchidos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
      // Busca o usuário pelo e-mail
      const user = await userRepository.findOne({ where: { email } });

      // Verifica se o usuário existe e se a senha é válida
      const senhaCorreta = user && await bcrypt.compare(password, user.password);
      if (!user || !senhaCorreta) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gera um token JWT com o ID e e-mail do usuário, válido por 24 horas
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string, // Chave secreta definida no .env
        { expiresIn: '24h' }
      );

      // Retorna o token e os dados do usuário (sem senha)
      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: omitPassword(user)
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
