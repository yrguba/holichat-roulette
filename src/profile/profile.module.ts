import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { CryptoService } from '../crypto/crypto.service';
import { DriverType, StorageModule } from '@codebrew/nestjs-storage';

@Module({
  imports: [
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
  ],
  controllers: [ProfileController],
  providers: [CryptoService],
})
export class ProfileModule {}
