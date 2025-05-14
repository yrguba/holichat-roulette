import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import {
  StorageModule,
  DriverType,
  StorageService,
} from '@codebrew/nestjs-storage';
import { LoggerModule } from './logger/logger.module';
import path, { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from './jwt/jwt.module';
import { CryptoModule } from './crypto/crypto.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { ShopsModule } from './modules/shops/shops.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { ConnectionsModule } from './connections/connections.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    CryptoModule,
    JwtModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    StorageModule.forRoot({
      default: 'local',
      disks: {
        local: {
          driver: DriverType.LOCAL,
          config: {
            root: process.cwd(),
          },
        },
      },
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/',
      rootPath: join(__dirname, '../front', 'build'),
      exclude: ['/api*'],
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/storage',
      rootPath: join(__dirname, '..', 'storage'),
      exclude: ['/api*'],
    }),
    UserModule,
    AuthModule,
    WarehouseModule,
    ReturnsModule,
    ShopsModule,
    OrganizationModule,
    ConnectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
//export class AppModule {}
export class AppModule {
  constructor(private storage: StorageService) {
    this.storage.getDisk().put('test.txt', 'text content');
  }
}
