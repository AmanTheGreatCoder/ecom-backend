import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should call authService login with correct loginDto', async () => {
      const dto: LoginDto = {
        email: 'affiliate1@gmail.com',
        password: '1234',
      };

      const loginResponse = {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJhZmZpbGlhdGUiLCJpYXQiOjE3MjU2MzI2NTAsImV4cCI6MTcyNTYzNjI1MH0.DD3BGQLfzUEY6WnS78hOtpt-usES1QAwftXcjpwP5QU',
        user: {
          id: 3,
          name: 'Affiliate 1',
          email: 'affiliate1@gmail.com',
          password: '1234',
          role: 'affiliate',
          createdAt: '2024-09-05T13:52:49.603Z',
          updatedAt: '2024-09-05T13:52:49.603Z',
          affiliate: {
            id: 1,
            userId: 3,
            commission: 15,
            visits: 57,
            visits_today: 57,
            conversion_rate: 2.43,
            total_sales: 2411,
            totalEarnings: 361.65,
            createdAt: '2024-09-05T13:52:49.607Z',
            updatedAt: '2024-09-06T06:13:12.942Z',
          },
        },
      };

      mockAuthService.login.mockResolvedValue(loginResponse);

      expect(await authController.login(dto)).toBe(loginResponse);
    });
  });
});
