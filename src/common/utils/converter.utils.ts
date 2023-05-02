import ms = require('ms');

import { TUnit } from '@common/types';

const COUNT_MS_IN_SECOND = 1000;
const COUNT_MS_IN_MINUTE = 60 * COUNT_MS_IN_SECOND;
const COUNT_MS_IN_HOUR = 60 * COUNT_MS_IN_MINUTE;
const COUNT_MS_IN_DAY = 24 * COUNT_MS_IN_HOUR;


export const converterFromExp = (exp: string, unit: TUnit): number => {
  const msByExp = ms(exp);
  switch (unit) {
    case 's':
      return msByExp / COUNT_MS_IN_SECOND;
    case 'm':
      return msByExp / COUNT_MS_IN_MINUTE;
    case 'h':
      return msByExp / COUNT_MS_IN_HOUR;
    case 'd':
      return msByExp / COUNT_MS_IN_DAY;
    default:
      return msByExp;
  }
};
