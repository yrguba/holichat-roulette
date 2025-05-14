import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  createBaseNestApplication,
  createBaseTestingModule,
  closeAllConnections,
} from '../src/utils/test/helpers/module';
import { AUTH_ROUTE_PREFIX } from '../src/constants/route';
import { UserFactory } from '../src/utils/test/factories/user.factory';
import { UserService } from '../src/user/user.service';
import { AuthModule } from '../src/auth/auth.module';
import { authenticatedRequest } from '../src/utils/test/helpers/request';
import { TokenService } from '../src/user/token.service';

const USER_ROUTE = `${AUTH_ROUTE_PREFIX}/user`;
const CONFIRM_ROUTE = `${AUTH_ROUTE_PREFIX}/send-confirmation`;
const LOGIN_ROUTE = `${AUTH_ROUTE_PREFIX}/login`;
const LOGOUT_ROUTE = `${AUTH_ROUTE_PREFIX}/logout`;

const FAKE_PHONE_NUMBER = `+79222222222`;
const FAKE_PHONE_NUMBER_NOT_FOUND = `+79333333333`;

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let userService: UserService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module = await createBaseTestingModule({
      imports: [AuthModule],
    }).compile();

    userFactory = new UserFactory().setModel(module);

    userService = module.get(UserService);

    tokenService = module.get(TokenService);

    app = await createBaseNestApplication(module);

    await app.init();
  });

  describe('user (POST)', () => {
    it('it should create a user', () => {
      return request(app.getHttpServer())
        .post(CONFIRM_ROUTE)
        .send({
          phone: FAKE_PHONE_NUMBER,
        })
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toHaveProperty('user');
          expect(response.body).toHaveProperty('token');
        });
    });
  });

  describe('user (GET)', () => {
    it('should return a user by token', async () => {
      const [user, token] = await userFactory.createWithToken();

      return authenticatedRequest(app.getHttpServer(), token)
        .get(USER_ROUTE)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body.phone).toEqual(user.phone);
        });
    });

    it('should return authentication error if token is invalid', async () => {
      return authenticatedRequest(app.getHttpServer(), 'invalid')
        .get(USER_ROUTE)
        .expect(HttpStatus.UNAUTHORIZED)
        .then((response) => {
          expect(response.body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('login (POST)', () => {
    it('should login a user (tokenCreated status)', async () => {
      const user = await userFactory.create();

      return request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send({
          phone: user.phone,
          code: '1111',
        })
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toHaveProperty('token');
        });
    });

    it('should return a bad request error if email is missing (notFoundUser status)', async () => {
      return request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send({
          phone: FAKE_PHONE_NUMBER_NOT_FOUND,
          code: '1111',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body.message).toEqual('User not found');
        });
    });

    it('should return a bad request error if code is missing', async () => {
      return request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send({
          phone: FAKE_PHONE_NUMBER_NOT_FOUND,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body.message).toEqual(['code should not be empty']);
        });
    });

    it('should return a bad request error if code is incorrect (codeNotMatched status)', async () => {
      const user = await userFactory.create();

      return request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send({
          phone: FAKE_PHONE_NUMBER,
          code: '9999',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body.message).toEqual('Wrong code');
        });
    });

    it('should return a server error if an exception occurs during findUserById (notFoundUser status)', async () => {
      const loginUserDto = {
        phone: FAKE_PHONE_NUMBER_NOT_FOUND,
        code: '4444',
      };

      jest.spyOn(userService, 'findOneByPhone').mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      return request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send(loginUserDto)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then((response) => {
          expect(response.body.message).toEqual('Server error');
        });
    });

    it('should return a server error if an exception occurs during creating a token (tokenNotCreated)', async () => {
      const user = await userFactory.create();
      const loginUserDto = {
        phone: user.phone,
        code: '1111',
      };

      jest.spyOn(tokenService, 'create').mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      return request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send(loginUserDto)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then((response) => {
          expect(response.body.message).toEqual('Server error');
        });
    });
  });

  describe('logout (POST)', () => {
    it('should successfully logout the user and clear the JWT cookie', async () => {
      const user = await userFactory.create();
      const token = await tokenService.create({ user });

      const response = await authenticatedRequest(app.getHttpServer(), token)
        .post(LOGOUT_ROUTE)
        .expect(HttpStatus.CREATED);

      const revokedToken = await tokenService.findUserByJtiAndUserId(
        user.tokens[0].jti,
        user.id,
      );
      expect(response.header['set-cookie'][0]).toMatch(/token=;/);
      expect(revokedToken).toBeNull();
    });

    it('should return an unauthorized error if the user is not authenticated', async () => {
      await request(app.getHttpServer())
        .post(LOGOUT_ROUTE)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterEach(async () => {
    await closeAllConnections({
      module: app,
    });
  });
});
