// Importa os tipos Request e Response do Express
import { Request, Response } from 'express';
// Importa a conexão com o banco de dados
import { AppDataSource } from '../config/database';
// Importa a entidade Cafe (modelo mapeado com TypeORM)
import { Cafe } from '../models/Cafe';
// Importa o operador Like para buscas parciais no banco
import { Like } from 'typeorm';

// Cria um repositório para manipular dados da tabela de cafés
const cafeRepository = AppDataSource.getRepository(Cafe);

// Controlador com todos os métodos relacionados aos cafés
export class CafeController {

  // =============================
  // Cadastrar um novo café
  // =============================
  async create(req: Request, res: Response) {
    try {
      // Extrai os campos enviados no corpo da requisição
      const { nome, origem, tipo, torra, aroma, sabor, preco, quantidadeEstoque } = req.body;

      // Verifica se todos os campos obrigatórios foram preenchidos
      if (!nome || !origem || !tipo || !torra || !aroma || !sabor || preco === undefined || quantidadeEstoque === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      // Garante que o preço e a quantidade sejam valores positivos
      if (preco < 0 || quantidadeEstoque < 0) {
        return res.status(400).json({ error: 'Preço e quantidade devem ser valores positivos' });
      }

      // Cria uma nova instância do café com os dados recebidos
      const cafe = cafeRepository.create({
        nome,
        origem,
        tipo,
        torra,
        aroma,
        sabor,
        preco: parseFloat(preco),
        quantidadeEstoque: parseInt(quantidadeEstoque)
      });

      // Salva o novo café no banco de dados
      await cafeRepository.save(cafe);

      // Retorna a resposta com status 201 (criado) e os dados do café
      res.status(201).json({
        message: 'Café cadastrado com sucesso',
        cafe
      });
    } catch (error) {
      console.error('Erro ao criar café:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // =============================
  // Listar todos os cafés
  // =============================
  async findAll(req: Request, res: Response) {
    try {
      // Busca todos os cafés no banco, ordenados do mais recente para o mais antigo
      const cafes = await cafeRepository.find({ order: { createdAt: 'DESC' } });

      // Retorna os cafés encontrados com total
      res.json({
        message: 'Cafés listados com sucesso',
        cafes,
        total: cafes.length
      });
    } catch (error) {
      console.error('Erro ao listar cafés:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // =============================
  // Buscar um café pelo ID
  // =============================
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca um café com o ID fornecido
      const cafe = await cafeRepository.findOne({ where: { id: Number(id) } });

      // Se não encontrar, retorna 404
      if (!cafe) {
        return res.status(404).json({ error: 'Café não encontrado' });
      }

      // Retorna o café encontrado
      res.json({
        message: 'Café encontrado',
        cafe
      });
    } catch (error) {
      console.error('Erro ao buscar café:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // =============================
  // Pesquisar cafés por nome, origem, tipo, etc.
  // =============================
  async search(req: Request, res: Response) {
    try {
      const { q } = req.query;

      // Se não for enviado nenhum termo de pesquisa
      if (!q) {
        return res.status(400).json({ error: 'Termo de pesquisa é obrigatório' });
      }

      const searchTerm = q as string;

      // Busca cafés que contenham o termo pesquisado em qualquer um dos campos
      const cafes = await cafeRepository.find({
        where: [
          { nome: Like(`%${searchTerm}%`) },
          { origem: Like(`%${searchTerm}%`) },
          { tipo: Like(`%${searchTerm}%`) },
          { torra: Like(`%${searchTerm}%`) },
          { aroma: Like(`%${searchTerm}%`) },
          { sabor: Like(`%${searchTerm}%`) }
        ],
        order: { createdAt: 'DESC' }
      });

      // Retorna o resultado da busca
      res.json({
        message: 'Pesquisa realizada com sucesso',
        cafes,
        total: cafes.length,
        searchTerm
      });
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // =============================
  // Filtrar cafés por critérios exatos
  // =============================
  async filter(req: Request, res: Response) {
    try {
      const { origem, tipo, torra, aroma, sabor } = req.query;

      const where: any = {};
      if (origem) where.origem = origem;
      if (tipo) where.tipo = tipo;
      if (torra) where.torra = torra;
      if (aroma) where.aroma = aroma;
      if (sabor) where.sabor = sabor;

      // Busca cafés que correspondam exatamente aos filtros
      const cafes = await cafeRepository.find({ where, order: { createdAt: 'DESC' } });

      res.json({
        message: 'Filtros aplicados com sucesso',
        cafes,
        total: cafes.length,
        filters: { origem, tipo, torra, aroma, sabor }
      });
    } catch (error) {
      console.error('Erro ao filtrar cafés:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // =============================
  // Atualizar um café existente
  // =============================
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, origem, tipo, torra, aroma, sabor, preco, quantidadeEstoque } = req.body;

      // Busca o café pelo ID
      const cafe = await cafeRepository.findOne({ where: { id: Number(id) } });
      if (!cafe) {
        return res.status(404).json({ error: 'Café não encontrado' });
      }

      // Validações dos campos atualizados
      if (preco !== undefined && preco < 0) {
        return res.status(400).json({ error: 'Preço deve ser um valor positivo' });
      }

      if (quantidadeEstoque !== undefined && quantidadeEstoque < 0) {
        return res.status(400).json({ error: 'Quantidade deve ser um valor positivo' });
      }

      // Atualiza apenas os campos enviados
      if (nome) cafe.nome = nome;
      if (origem) cafe.origem = origem;
      if (tipo) cafe.tipo = tipo;
      if (torra) cafe.torra = torra;
      if (aroma) cafe.aroma = aroma;
      if (sabor) cafe.sabor = sabor;
      if (preco !== undefined) cafe.preco = parseFloat(preco);
      if (quantidadeEstoque !== undefined) cafe.quantidadeEstoque = parseInt(quantidadeEstoque);

      await cafeRepository.save(cafe);

      res.json({
        message: 'Café atualizado com sucesso',
        cafe
      });
    } catch (error) {
      console.error('Erro ao atualizar café:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // =============================
  // Deletar café pelo ID
  // =============================
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cafe = await cafeRepository.findOne({ where: { id: Number(id) } });
      if (!cafe) {
        return res.status(404).json({ error: 'Café não encontrado' });
      }

      // Remove o café do banco de dados
      await cafeRepository.remove(cafe);

      res.json({
        message: 'Café deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar café:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
