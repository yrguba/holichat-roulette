import { TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserFactory } from '../utils/test/factories/user.factory';
import {
  closeAllConnections,
  createBaseTestingModule,
} from '../utils/test/helpers/module';

describe('UserService', () => {
  let module: TestingModule;
  let service: UserService;
  let userFactory: UserFactory;

  beforeEach(async () => {
    module = await createBaseTestingModule({}).compile();

    service = module.get<UserService>(UserService);

    userFactory = new UserFactory().setModel(module);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const code = '1234';

      const user = await service.create({
        phone: '+79817830113',
        firstName: userFactory.faker.name.firstName(),
        lastName: userFactory.faker.name.lastName(),
        code: code,
      });

      expect(user).toBeDefined();
      expect(user.code).not.toEqual(code);
    });
  });

  describe('findOneByPhone', () => {
    it('should find a user by phone', async () => {
      const user = await userFactory.create();

      const foundUser = await service.findOneByPhone(user.phone);

      expect(foundUser).toBeDefined();
    });
  });

  describe('findOneById', () => {
    it('should find a user by id', async () => {
      const user = await userFactory.create();

      const foundUser = await service.findOneById(user.id);

      expect(foundUser).toBeDefined();
    });
  });

  afterEach(async () => {
    await closeAllConnections({
      module,
    });
  });
});
