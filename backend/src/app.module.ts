import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { PersonsModule } from './persons/persons.module';
import { VettingModule } from './vetting/vetting.module';
import { StorageModule } from './storage/storage.module';
import { SearchModule } from './search/search.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    PostsModule,
    PersonsModule,
    VettingModule,
    StorageModule,
    SearchModule,
  ],
})
export class AppModule {}
