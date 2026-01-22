import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@shared/config/app.config';
import databaseConfig from '@shared/config/database.config';
import redisConfig from '@shared/config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [appConfig, databaseConfig, redisConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
