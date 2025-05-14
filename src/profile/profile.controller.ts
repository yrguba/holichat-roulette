import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { I18nService } from 'nestjs-i18n';
import { AppLogger } from '../logger/app-logger.service';
import MongooseClassSerializerInterceptor from '../mongoose/interceptors/mongoose-class-serializer.interceptor';
import { User as UserModel, UserDocument } from '../user/schemas/user.schema';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { PROFILE_ROUTE_PREFIX } from '../constants/route';
import { TokenService } from '../user/token.service';
import { CryptoService } from '../crypto/crypto.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CustomUploadFileTypeValidator,
  MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
  VALID_UPLOADS_MIME_TYPES,
} from './validators/CustomUploadFileTypeValidator';
import { StorageService } from '@codebrew/nestjs-storage';
import { interpret } from 'xstate';
import userUpdateMachine from './machines/user-update.machine';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createDirIfNotExist } from '../storage/utils/storage.utils';
import { User } from '../auth/decorators/user.decorator';

@Controller(PROFILE_ROUTE_PREFIX)
@UseInterceptors(MongooseClassSerializerInterceptor(UserModel))
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private i18n: I18nService,
    private readonly logger: AppLogger,
    private readonly cryptoService: CryptoService,
    private storage: StorageService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUser(@User() user: UserDocument) {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'user_id', required: true })
  @Patch('/:user_id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        birthDay: { type: 'string' },
        avatar: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar'))
  updateProfile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({
            fileType: VALID_UPLOADS_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    avatar,
    @Body() updateUserDto: UpdateUserDto,
    @Param() params,
  ) {
    const service = interpret(
      userUpdateMachine
        .withContext({
          dto: updateUserDto,
        })
        .withConfig({
          services: {
            checkUserIfExists: async () => {
              try {
                const user = await this.userService.findOneById(params.user_id);

                if (!user) {
                  return Promise.reject({
                    error: this.i18n.translate('errors.notfound'),
                    status: HttpStatus.NOT_FOUND,
                  });
                }
                return Promise.resolve(true);
              } catch (e) {
                this.logger.error(e);
                return Promise.reject({
                  error: this.i18n.translate('errors.notfound'),
                  status: HttpStatus.NOT_FOUND,
                });
              }
            },
            updateUser: async (context) => {
              let avatarUrl = '';
              try {
                if (avatar) {
                  const avatarPath = createDirIfNotExist(
                    `storage/users/${params.user_id}/avatar`,
                  );

                  await this.storage
                    .getDisk()
                    .append(
                      `${avatarPath}/${params.user_id}.jpg`,
                      avatar.buffer,
                    );
                  avatarUrl = `${avatarPath}/${params.user_id}.jpg`;
                }

                // const user = await this.userService.updateUser(params.user_id, {
                //   ...context.dto,
                //   avatar: avatarUrl ? avatarUrl : undefined,
                // });

                return Promise.resolve({
                  //user,
                });
              } catch (e) {
                this.logger.error(e);
                return Promise.reject({
                  error: this.i18n.translate('errors.server'),
                  status: HttpStatus.INTERNAL_SERVER_ERROR,
                });
              }
            },
          },
        }),
    );
    return new Promise((resolve, reject) => {
      service
        .onDone(() => {
          const snapshot = service.getSnapshot();

          if (snapshot.matches('error')) {
            reject(
              new HttpException(
                snapshot.context.error,
                snapshot.context.status,
              ),
            );

            return;
          }

          resolve({
            user: snapshot.context.user,
          });
        })
        .start();
    });
  }
}
