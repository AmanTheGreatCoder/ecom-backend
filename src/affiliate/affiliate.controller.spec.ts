import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateController } from './affiliate.controller';
import { AffiliateService } from './affiliate.service';
import { CreateAffiliateLinkDto } from './dto/create-affiliate-link.dto';
import { RegisterClickDto } from './dto/register-click.dto';

describe('AffiliateController', () => {
  let affiliateController: AffiliateController;
  let affiliateService: AffiliateService;

  const mockAffiliateService = {
    createAffiliateLink: jest.fn(),
    getAllAffiliateLinksData: jest.fn(),
    registerClick: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffiliateController],
      providers: [
        {
          provide: AffiliateService,
          useValue: mockAffiliateService,
        },
      ],
    }).compile();

    affiliateController = module.get<AffiliateController>(AffiliateController);
    affiliateService = module.get<AffiliateService>(AffiliateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAffiliateLink', () => {
    it('should call AffiliateService.createAffiliateLink with the correct DTO', async () => {
      const dto: CreateAffiliateLinkDto = {
        affiliateId: 1,
        productId: 1,
      };

      const mockResponse = {
        id: 9,
        affiliateId: 1,
        link: 'http://localhost:3000/products/7?code=1',
        productId: 7,
        clicks: 0,
        sales: 0,
        conversionRate: 0,
        totalRevenue: 0,
        commissionEarned: 0,
        createdAt: new Date('2024-09-06T15:11:16.767Z'),
      };

      mockAffiliateService.createAffiliateLink.mockResolvedValue(mockResponse);

      const result = await affiliateController.createAffiliateLink(dto);

      expect(result).toBe(mockResponse);
      expect(affiliateService.createAffiliateLink).toHaveBeenCalledWith(1);
    });
  });

  describe('registerClick', () => {
    it('should call AffiliateService.registerClick with the correct affiliateLinkId', async () => {
      const dto: RegisterClickDto = {
        affiliateId: 1,
        productId: 1,
      };
      const mockResponse = { success: true };

      mockAffiliateService.registerClick.mockResolvedValue(mockResponse);

      const result = await affiliateController.registerClick(dto);

      expect(result).toBe(mockResponse);
      expect(affiliateService.registerClick).toHaveBeenCalledWith(1);
    });
  });
});
