import { ConfigModule, ConfigService } from '@nestjs/config';
import type { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/common';

const options = async (cs: ConfigService): RedisClientOptions => ({});

export const CM = CacheModule.registerAsync<RedisClientOptions>({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: options,
});
