const Product = require('../models/Product');

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    const cartItem = {
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock
      },
      quantity: quantity,
      subtotal: product.price * quantity
    };

    res.status(200).json({ 
      success: true, 
      message: 'Item added to cart',
      data: cartItem 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const validateCartItems = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    const validatedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product with id ${item.productId} not found` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: subtotal,
        image: product.image
      });
    }

    res.json({ 
      success: true, 
      data: {
        items: validatedItems,
        totalAmount: totalAmount,
        itemCount: validatedItems.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCartSummary = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ success: false, message: 'Product IDs are required' });
    }

    const products = await Product.find({ _id: { $in: productIds }, isActive: true });
    
    const cartSummary = products.map(product => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      category: product.category
    }));

    res.json({ success: true, data: cartSummary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  validateCartItems,
  getCartSummary
}; 