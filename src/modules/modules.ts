import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { ConfigModule } from '@nestjs/config';
import path = require('path');

import { validationSchema } from '@common/config';

import { SeanceModule } from '@modules/seance/seance.module';
import { UserModule } from '@modules/user/user.module';
import { RoleModule } from '@modules/role/role.module';

import DB from '../DB';

export const modules = [
  ConfigModule.forRoot({
    validationSchema,
    isGlobal: true,
  }),
  I18nModule.forRoot({
    fallbackLanguage: 'ru',
    loaderOptions: {
      path: path.join(__dirname, '../common/i18n/'),
      watch: true,
    },
    resolvers: [
      { use: QueryResolver, options: ['lang'] },
      AcceptLanguageResolver,
    ],
    typesOutputPath: path.join(
      __dirname,
      '../../src/common/i18n/generated/i18n.generated.ts',
    ),
  }),
  SeanceModule,
  UserModule,
  RoleModule,
  DB,
];
