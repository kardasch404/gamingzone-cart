import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import appConfig from '@shared/config/app.config';
import databaseConfig from '@shared/config/database.config';
import redisConfig from '@shared/config/redis.config';
import { RedisModule } from '@infrastructure/cache/redis/redis.module';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';
import { CartModule } from '@presentation/rest/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [appConfig, databaseConfig, redisConfig],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    RedisModule,
    PrismaModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
