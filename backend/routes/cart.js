const express = require('express');
const router = express.Router();
const { addToCart, validateCartItems, getCartSummary } = require('../controllers/cartController');
const { validateCartItem } = require('../middleware/validation');

router.post('/add', validateCartItem, addToCart);

router.post('/validate', validateCartItems);

router.post('/summary', getCartSummary);

module.exports = router; 