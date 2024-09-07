import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { BuyDto } from './dto/buy,dto';

describe('ProductController', () => {
  let productController: ProductController;

  const mockProductService = {
    getAllProducts: jest.fn(),
    buyProduct: jest.fn(),
    getProductById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
  });

  describe('getAllProducts', () => {
    it('should return products without affiliateId', async () => {
      const result = [{ id: 1, name: 'Product1' }];
      mockProductService.getAllProducts.mockResolvedValue(result);

      expect(await productController.getAllProducts()).toBe(result);
    });

    it('should return products with affiliateId', async () => {
      const affiliateId = '2';
      const result = [
        {
          id: 1,
          name: 'Product1',
          affiliateLink: [
            {
              id: 1,
              affiliateId: 2,
              link: 'https://example.com',
              productId: 1,
              clicks: 0,
              sales: 0,
              conversionRate: 0.0,
              totalRevenue: 0.0,
              commissionEarned: 0.0,
              createdAt: new Date(),
            },
          ],
        },
      ];
      mockProductService.getAllProducts.mockResolvedValue(result);

      expect(await productController.getAllProducts(affiliateId)).toBe(result);
      expect(mockProductService.getAllProducts).toHaveBeenCalledWith(2);
    });
  });

  describe('buyProduct', () => {
    it('should successfully buy a product', async () => {
      const dto: BuyDto = { productId: 2, affiliateId: 2 };
      const result = { success: true };
      mockProductService.buyProduct.mockResolvedValue(result);

      expect(await productController.buyProduct(dto)).toBe(result);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const result = { id: 1, name: 'Product1' };
      mockProductService.getProductById.mockResolvedValue(result);

      expect(await productController.getProductById(1)).toBe(result);
    });
  });
});
