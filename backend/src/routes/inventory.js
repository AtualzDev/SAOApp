
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Products
router.get('/products', inventoryController.listProducts);
router.post('/products', inventoryController.createProduct);
router.put('/products/:id', inventoryController.updateProduct);
router.delete('/products/:id', inventoryController.deleteProduct);

// Units
router.get('/units', inventoryController.listUnits);
router.post('/units', inventoryController.createUnit);

// Sectors
router.get('/sectors', inventoryController.listSectors);
router.post('/sectors', inventoryController.createSector);
router.put('/sectors/:id', inventoryController.updateSector);
router.delete('/sectors/:id', inventoryController.deleteSector);

// Categories
router.get('/categories', inventoryController.listCategories);
router.post('/categories', inventoryController.createCategory);
router.put('/categories/:id', inventoryController.updateCategory);
router.delete('/categories/:id', inventoryController.deleteCategory);

// Suppliers
router.get('/suppliers', inventoryController.listSuppliers);
router.post('/suppliers', inventoryController.createSupplier);

// Transactions
router.get('/transactions', inventoryController.listTransactions);
router.post('/transactions', inventoryController.createLaunch);
router.post('/launch', inventoryController.createLaunch);
router.put('/launch/:id', inventoryController.updateLaunch);

module.exports = router;
