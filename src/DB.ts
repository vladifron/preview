import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import * as cls from 'cls-hooked';

const namespace = cls.createNamespace('transaction-namespace');

Sequelize.useCLS(namespace);

const DB = SequelizeModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    password: configService.get<string>('***'),
    database: configService.get<string>('***'),
    username: configService.get<string>('***'),
    port: configService.get<number>('***'),
    host: configService.get<string>('***'),
    autoLoadModels: true,
    dialect: 'postgres',
    synchronize: true,
    logging: false,
  }),
});

export default DB;
