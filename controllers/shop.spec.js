const shopController = require('./shop');
const Product = require('../models/product');
const Order = require('../models/order');

// Mock the models
jest.mock('../models/product');
jest.mock('../models/order');

describe('Shop Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      params: {},
      user: {
        _id: 'user123',
        name: 'Test User',
        addToCart: jest.fn(),
        deleteItemFromCart: jest.fn(),
        populate: jest.fn(),
        clearCart: jest.fn(),
      },
    };

    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    };

    next = jest.fn();
  });

  describe('getProducts', () => {
    test('should fetch and render all products', (done) => {
      const mockProducts = [
        {
          _id: 'prod1',
          title: 'Product 1',
          price: 99.99,
          description: 'Description 1',
          imageURL: 'http://example.com/1.jpg',
        },
        {
          _id: 'prod2',
          title: 'Product 2',
          price: 199.99,
          description: 'Description 2',
          imageURL: 'http://example.com/2.jpg',
        },
      ];

      Product.find = jest.fn().mockResolvedValue(mockProducts);

      shopController.getProducts(req, res, next);

      setTimeout(() => {
        expect(Product.find).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('shop/product-list', {
          prods: mockProducts,
          pageTitle: 'All Products',
        });
        done();
      }, 100);
    });

    test('should handle empty product list', (done) => {
      Product.find = jest.fn().mockResolvedValue([]);

      shopController.getProducts(req, res, next);

      setTimeout(() => {
        expect(Product.find).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('shop/product-list', {
          prods: [],
          pageTitle: 'All Products',
        });
        done();
      }, 100);
    });

    test('should handle fetch errors', (done) => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      Product.find = jest.fn().mockRejectedValue(new Error('Database error'));

      shopController.getProducts(req, res, next);

      setTimeout(() => {
        expect(Product.find).toHaveBeenCalled();
        consoleSpy.mockRestore();
        done();
      }, 100);
    });
  });

  describe('getProduct', () => {
    test('should fetch and render single product details', (done) => {
      req.params.productId = 'prod1';
      const mockProduct = {
        _id: 'prod1',
        title: 'Test Product',
        price: 99.99,
        description: 'Test description',
        imageURL: 'http://example.com/test.jpg',
      };

      Product.findById = jest.fn().mockResolvedValue(mockProduct);

      shopController.getProduct(req, res, next);

      setTimeout(() => {
        expect(Product.findById).toHaveBeenCalledWith('prod1');
        expect(res.render).toHaveBeenCalledWith('shop/product-details', {
          product: mockProduct,
          pageTitle: 'Test Product',
        });
        done();
      }, 100);
    });

  });

  describe('getIndex', () => {
    test('should fetch and render all products for index page', (done) => {
      const mockProducts = [
        {
          _id: 'prod1',
          title: 'Product 1',
          price: 99.99,
        },
        {
          _id: 'prod2',
          title: 'Product 2',
          price: 199.99,
        },
      ];

      Product.find = jest.fn().mockResolvedValue(mockProducts);

      shopController.getIndex(req, res, next);

      setTimeout(() => {
        expect(Product.find).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('shop/index', {
          prods: mockProducts,
          pageTitle: 'Shop',
        });
        done();
      }, 100);
    });

    test('should handle empty products for index', (done) => {
      Product.find = jest.fn().mockResolvedValue([]);

      shopController.getIndex(req, res, next);

      setTimeout(() => {
        expect(res.render).toHaveBeenCalledWith('shop/index', {
          prods: [],
          pageTitle: 'Shop',
        });
        done();
      }, 100);
    });
  });

  describe('postCart', () => {
    test('should add product to cart and redirect', (done) => {
      req.body.productId = 'prod1';
      const mockProduct = {
        _id: 'prod1',
        title: 'Test Product',
        price: 99.99,
      };

      Product.findById = jest.fn().mockResolvedValue(mockProduct);
      req.user.addToCart = jest.fn().mockResolvedValue({ success: true });

      shopController.postCart(req, res, next);

      setTimeout(() => {
        expect(Product.findById).toHaveBeenCalledWith('prod1');
        expect(req.user.addToCart).toHaveBeenCalledWith(mockProduct);
        expect(res.redirect).toHaveBeenCalledWith('/cart');
        done();
      }, 100);
    });

    test('should handle product not found when adding to cart', (done) => {
      req.body.productId = 'nonexistent';

      Product.findById = jest.fn().mockResolvedValue(null);

      shopController.postCart(req, res, next);

      setTimeout(() => {
        expect(Product.findById).toHaveBeenCalledWith('nonexistent');
        done();
      }, 100);
    });
  });

  describe('postCartDelete', () => {
    test('should delete item from cart and redirect', (done) => {
      req.body.productId = 'prod1';
      req.user.deleteItemFromCart = jest.fn().mockResolvedValue({ success: true });

      shopController.postCartDelete(req, res, next);

      setTimeout(() => {
        expect(req.user.deleteItemFromCart).toHaveBeenCalledWith('prod1');
        expect(res.redirect).toHaveBeenCalledWith('/cart');
        done();
      }, 100);
    });

    test('should handle deletion errors', (done) => {
      req.body.productId = 'prod1';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      req.user.deleteItemFromCart = jest.fn().mockRejectedValue(new Error('Deletion failed'));

      shopController.postCartDelete(req, res, next);

      setTimeout(() => {
        expect(req.user.deleteItemFromCart).toHaveBeenCalledWith('prod1');
        consoleSpy.mockRestore();
        done();
      }, 100);
    });
  });

  describe('getCart', () => {
    test('should fetch and render cart with products', (done) => {
      const mockCartItems = [
        {
          quantity: 2,
          productId: {
            _id: 'prod1',
            title: 'Product 1',
            price: 99.99,
          },
        },
        {
          quantity: 1,
          productId: {
            _id: 'prod2',
            title: 'Product 2',
            price: 199.99,
          },
        },
      ];

      const mockUser = {
        cart: {
          items: mockCartItems,
        },
      };

      req.user.populate = jest.fn().mockResolvedValue(mockUser);

      shopController.getCart(req, res, next);

      setTimeout(() => {
        expect(req.user.populate).toHaveBeenCalledWith('cart.items.productId');
        expect(res.render).toHaveBeenCalledWith('shop/cart', {
          pageTitle: 'My Cart',
          products: mockCartItems,
        });
        done();
      }, 100);
    });

    test('should handle empty cart', (done) => {
      const mockUser = {
        cart: {
          items: [],
        },
      };

      req.user.populate = jest.fn().mockResolvedValue(mockUser);

      shopController.getCart(req, res, next);

      setTimeout(() => {
        expect(res.render).toHaveBeenCalledWith('shop/cart', {
          pageTitle: 'My Cart',
          products: [],
        });
        done();
      }, 100);
    });

    test('should handle cart fetch errors', (done) => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      req.user.populate = jest.fn().mockRejectedValue(new Error('Fetch failed'));

      shopController.getCart(req, res, next);

      setTimeout(() => {
        expect(req.user.populate).toHaveBeenCalledWith('cart.items.productId');
        consoleSpy.mockRestore();
        done();
      }, 100);
    });
  });

  describe('postOrder', () => {
    test('should create order and clear cart', (done) => {
      const mockCartItems = [
        {
          quantity: 2,
          productId: {
            _id: 'prod1',
            title: 'Product 1',
            price: 99.99,
            _doc: {
              _id: 'prod1',
              title: 'Product 1',
              price: 99.99,
            },
          },
        },
      ];

      const mockUser = {
        name: 'Test User',
        cart: {
          items: mockCartItems,
        },
      };

      req.user.populate = jest.fn().mockResolvedValue(mockUser);
      req.user.clearCart = jest.fn().mockResolvedValue({ success: true });

      // Mock Order constructor and save
      Order.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({ success: true }),
      }));

      shopController.postOrder(req, res, next);

      setTimeout(() => {
        expect(req.user.populate).toHaveBeenCalledWith('cart.items.productId');
        expect(req.user.clearCart).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/orders');
        done();
      }, 100);
    });

    test('should handle order creation errors', (done) => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      req.user.populate = jest.fn().mockRejectedValue(new Error('Order creation failed'));

      shopController.postOrder(req, res, next);

      setTimeout(() => {
        expect(req.user.populate).toHaveBeenCalledWith('cart.items.productId');
        consoleSpy.mockRestore();
        done();
      }, 100);
    });
  });

  describe('getOrders', () => {
    test('should fetch and render user orders', (done) => {
      const mockOrders = [
        {
          _id: 'order1',
          user: {
            name: 'Test User',
            userId: 'user123',
          },
          products: [
            {
              quantity: 2,
              product: {
                _id: 'prod1',
                title: 'Product 1',
                price: 99.99,
              },
            },
          ],
        },
        {
          _id: 'order2',
          user: {
            name: 'Test User',
            userId: 'user123',
          },
          products: [],
        },
      ];

      Order.find = jest.fn().mockResolvedValue(mockOrders);

      shopController.getOrders(req, res, next);

      setTimeout(() => {
        expect(Order.find).toHaveBeenCalledWith({ 'user.userId': 'user123' });
        expect(res.render).toHaveBeenCalledWith('shop/orders', {
          pageTitle: 'My Orders',
          orders: mockOrders,
        });
        done();
      }, 100);
    });

    test('should handle empty orders list', (done) => {
      Order.find = jest.fn().mockResolvedValue([]);

      shopController.getOrders(req, res, next);

      setTimeout(() => {
        expect(res.render).toHaveBeenCalledWith('shop/orders', {
          pageTitle: 'My Orders',
          orders: [],
        });
        done();
      }, 100);
    });

    test('should handle order fetch errors', (done) => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      Order.find = jest.fn().mockRejectedValue(new Error('Fetch failed'));

      shopController.getOrders(req, res, next);

      setTimeout(() => {
        expect(Order.find).toHaveBeenCalledWith({ 'user.userId': 'user123' });
        consoleSpy.mockRestore();
        done();
      }, 100);
    });
  });
});
