import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be created random string', function () {
    const randomString = service.randomString(1);

    expect(randomString).toHaveLength(2);
  });

  it('should hash a code with bcrypt', async () => {
    const code = '1234';
    const hashedCode = await service.hashCode(code, 1);

    expect(hashedCode).toBeDefined();
    expect(hashedCode).not.toEqual(code);
  });
  it('should compare a plaintext code to a hashed code', async () => {
    const code = '1234';
    const hashedCode = await service.hashCode(code);
    const isMatch = await service.compareCodes(code, hashedCode);

    expect(isMatch).toBe(true);
  });

  it('should return false for mismatched codes', async () => {
    const code = '1234';
    const hashedCode = await service.hashCode(code);
    const isMatch = await service.compareCodes('wrongCode', hashedCode);

    expect(isMatch).toBe(false);
  });
});
