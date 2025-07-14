"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CafeController_1 = require("../controllers/CafeController");
const router = (0, express_1.Router)();
const cafeController = new CafeController_1.CafeController();
// Aplicar middleware de autenticação em todas as rota
router.post('/', cafeController.create.bind(cafeController));
router.get('/', cafeController.findAll.bind(cafeController));
router.get('/search', cafeController.search.bind(cafeController));
router.get('/filter', cafeController.filter.bind(cafeController));
router.get('/:id', cafeController.findById.bind(cafeController));
router.put('/:id', cafeController.update.bind(cafeController));
router.delete('/:id', cafeController.delete.bind(cafeController));
exports.default = router;
