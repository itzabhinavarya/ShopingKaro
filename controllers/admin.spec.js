const adminController = require('./admin');
const Product = require('../models/product');

// Mock the Product model
jest.mock('../models/product');

describe('Admin Controller', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock request and response objects
    req = {
      body: {},
      params: {},
      query: {},
      user: {
        _id: 'user123',
        name: 'Test User',
      },
    };

    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      sendFile: jest.fn(),
    };

    next = jest.fn();
  });

  describe('getAddProduct', () => {
    test('should render add-product view with editing false', () => {
      adminController.getAddProduct(req, res, next);

      expect(res.render).toHaveBeenCalledWith('admin/edit-product', {
        pageTitle: 'Add-Product',
        editing: false,
      });
    });

    test('should call res.render once', () => {
      adminController.getAddProduct(req, res, next);

      expect(res.render).toHaveBeenCalledTimes(1);
    });
  });

  describe('postAddProduct', () => {
    test('should create and save a new product', (done) => {
      req.body = {
        title: 'Test Product',
        imageURL: 'http://example.com/image.jpg',
        description: 'A test product',
        price: 99.99,
      };

      const mockSave = jest.fn().mockResolvedValue({});
      Product.mockImplementation(() => ({
        save: mockSave,
      }));

      adminController.postAddProduct(req, res, next);

      setTimeout(() => {
        expect(Product).toHaveBeenCalledWith({
          title: 'Test Product',
          price: 99.99,
          description: 'A test product',
          imageURL: 'http://example.com/image.jpg',
          userId: req.user,
        });

        expect(mockSave).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/admin/products');
        done();
      }, 100);
    });

    test('should handle product save errors', (done) => {
      req.body = {
        title: 'Test Product',
        imageURL: 'http://example.com/image.jpg',
        description: 'A test product',
        price: 99.99,
      };

      const mockError = new Error('Database error');
      const mockSave = jest.fn().mockRejectedValue(mockError);

      Product.mockImplementation(() => ({
        save: mockSave,
      }));

      // Suppress console.log output during test
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      adminController.postAddProduct(req, res, next);

      setTimeout(() => {
        expect(mockSave).toHaveBeenCalled();
        expect(res.redirect).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
        done();
      }, 100);
    });
  });

  describe('getEditProduct', () => {
    test('should redirect if edit query parameter is missing', () => {
      req.query.edit = null;
      req.params.prodId = 'product123';

      adminController.getEditProduct(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('should render edit-product view when product is found', (done) => {
      req.query.edit = true;
      req.params.prodId = 'product123';

      const mockProduct = {
        _id: 'product123',
        title: 'Test Product',
        price: 99.99,
        description: 'A test product',
        imageURL: 'http://example.com/image.jpg',
      };

      Product.findById = jest.fn().mockResolvedValue(mockProduct);

      adminController.getEditProduct(req, res, next);

      setTimeout(() => {
        expect(Product.findById).toHaveBeenCalledWith('product123');
        expect(res.render).toHaveBeenCalledWith('admin/edit-product', {
          pageTitle: 'Edit-Product',
          editing: true,
          product: mockProduct,
        });
        done();
      }, 100);
    });

    test('should redirect if product is not found', (done) => {
      req.query.edit = true;
      req.params.prodId = 'product123';

      Product.findById = jest.fn().mockResolvedValue(null);

      adminController.getEditProduct(req, res, next);

      setTimeout(() => {
        expect(Product.findById).toHaveBeenCalledWith('product123');
        expect(res.redirect).toHaveBeenCalledWith('/');
        done();
      }, 100);
    });
  });

  describe('postEditProduct', () => {
    test('should update product successfully', (done) => {
      req.body = {
        productId: 'product123',
        title: 'Updated Product',
        imageURL: 'http://example.com/updated.jpg',
        description: 'Updated description',
        price: 149.99,
      };

      const mockProduct = {
        title: 'Old Product',
        price: 99.99,
        description: 'Old description',
        imageURL: 'http://example.com/old.jpg',
        save: jest.fn().mockResolvedValue({ success: true }),
      };

      Product.findById = jest.fn().mockResolvedValue(mockProduct);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      adminController.postEditProduct(req, res, next);

      setTimeout(() => {
        expect(Product.findById).toHaveBeenCalledWith('product123');
        expect(mockProduct.title).toBe('Updated Product');
        expect(mockProduct.price).toBe(149.99);
        expect(mockProduct.description).toBe('Updated description');
        expect(mockProduct.imageURL).toBe('http://example.com/updated.jpg');
        expect(mockProduct.save).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/admin/products');
        consoleSpy.mockRestore();
        done();
      }, 100);
    });

    test('should handle product update errors', (done) => {
      req.body = {
        productId: 'product123',
        title: 'Updated Product',
        imageURL: 'http://example.com/updated.jpg',
        description: 'Updated description',
        price: 149.99,
      };

      const mockError = new Error('Update failed');
      Product.findById = jest.fn().mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      adminController.postEditProduct(req, res, next);

      setTimeout(() => {
        expect(Product.findById).toHaveBeenCalledWith('product123');
        expect(res.redirect).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
        done();
      }, 100);
    });
  });

  describe('getProduct', () => {
    test('should fetch and render all products', (done) => {
      const mockProducts = [
        {
          _id: 'product1',
          title: 'Product 1',
          price: 99.99,
          description: 'Description 1',
          imageURL: 'http://example.com/1.jpg',
        },
        {
          _id: 'product2',
          title: 'Product 2',
          price: 199.99,
          description: 'Description 2',
          imageURL: 'http://example.com/2.jpg',
        },
      ];

      Product.find = jest.fn().mockResolvedValue(mockProducts);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      adminController.getProduct(req, res, next);

      setTimeout(() => {
        expect(Product.find).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('admin/products', {
          prods: mockProducts,
          pageTitle: 'Admin Products',
        });
        consoleSpy.mockRestore();
        done();
      }, 100);
    });

    test('should handle empty product list', (done) => {
      Product.find = jest.fn().mockResolvedValue([]);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      adminController.getProduct(req, res, next);

      setTimeout(() => {
        expect(Product.find).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('admin/products', {
          prods: [],
          pageTitle: 'Admin Products',
        });
        consoleSpy.mockRestore();
        done();
      }, 100);
    });
  });

  describe('postDeleteProduct', () => {
    test('should delete a product successfully', (done) => {
      req.body = {
        productId: 'product123',
      };

      Product.findByIdAndDelete = jest.fn().mockResolvedValue({});
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      adminController.postDeleteProduct(req, res, next);

      setTimeout(() => {
        expect(Product.findByIdAndDelete).toHaveBeenCalledWith('product123');
        expect(res.redirect).toHaveBeenCalledWith('/admin/products');
        consoleSpy.mockRestore();
        done();
      }, 100);
    });
  });
});
