const express = require('express');
const router = express.Router();
const basketsController = require('../controllers/basketsController');

// CRUD
router.get('/', basketsController.listBaskets);
router.get('/:id', basketsController.getBasket);
router.post('/', basketsController.createBasket);
router.put('/:id', basketsController.updateBasket);
router.delete('/:id', basketsController.deleteBasket);

// Actions
router.post('/:id/donate', basketsController.donateBasket);

module.exports = router;
