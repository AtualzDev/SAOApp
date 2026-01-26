
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

// Baskets
router.get('/baskets', inventoryController.listBaskets);
router.post('/baskets', inventoryController.createBasket);
router.get('/baskets/:id', inventoryController.getBasket);
router.put('/baskets/:id', inventoryController.updateBasket);
router.delete('/baskets/:id', inventoryController.deleteBasket);

// Transactions Lists
router.get('/transactions', inventoryController.listTransactions);
router.get('/entries', inventoryController.listEntries);
router.get('/exits', inventoryController.listExits);

// Entries (Individual)
router.post('/entries', inventoryController.createEntry);
router.get('/entries/:id', inventoryController.getEntry);
router.put('/entries/:id', inventoryController.updateEntry);
router.delete('/entries/:id', inventoryController.deleteEntry);

// Exits (Individual)
router.post('/exits', inventoryController.createExit);
router.get('/exits/:id', inventoryController.getExit);
router.put('/exits/:id', inventoryController.updateExit);
router.delete('/exits/:id', inventoryController.deleteExit);

module.exports = router;
