const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

router.post('/', authenticateToken, validateOrder, createOrder);

router.get('/', authenticateToken, getUserOrders);

router.get('/:orderId', authenticateToken, getOrderById);

router.patch('/:orderId/status', authenticateToken, updateOrderStatus);

module.exports = router; 