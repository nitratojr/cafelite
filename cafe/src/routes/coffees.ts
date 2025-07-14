import { Router } from 'express';
import { CafeController } from '../controllers/CafeController';


const router = Router();
const cafeController = new CafeController();

// Aplicar middleware de autenticação em todas as rota

router.post('/', cafeController.create.bind(cafeController));
router.get('/', cafeController.findAll.bind(cafeController));
router.get('/search', cafeController.search.bind(cafeController));
router.get('/filter', cafeController.filter.bind(cafeController));
router.get('/:id', cafeController.findById.bind(cafeController));
router.put('/:id', cafeController.update.bind(cafeController));
router.delete('/:id', cafeController.delete.bind(cafeController));

export default router;

