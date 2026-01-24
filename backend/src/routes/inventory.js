
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Products
// Products
router.get('/products', inventoryController.listProducts);
router.post('/products', inventoryController.createProduct);

// Units
router.get('/units', inventoryController.listUnits);
router.post('/units', inventoryController.createUnit);

// Categories
// Categories
router.get('/categories', inventoryController.listCategories);
router.post('/categories', inventoryController.createCategory);

// Suppliers
router.get('/suppliers', inventoryController.listSuppliers);
router.post('/suppliers', inventoryController.createSupplier);

// Transactions
router.get('/transactions', inventoryController.listTransactions);
router.post('/transactions', inventoryController.createLaunch); // Rename or add new endpoint
router.post('/launch', inventoryController.createLaunch);
router.put('/launch/:id', inventoryController.updateLaunch);

module.exports = router;
