import { Module } from '@nestjs/common';
import { VettingService } from './vetting.service';
import { VettingController } from './vetting.controller';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VettingController],
  providers: [VettingService],
  exports: [VettingService],
})
export class VettingModule {}
