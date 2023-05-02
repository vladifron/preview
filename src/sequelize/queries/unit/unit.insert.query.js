import path from 'path';

import Saver from '../Saver';

import { defaultUnits } from './defaultUnits';

const getUnits = () =>
  Saver.processFile(
    path.dirname(__filename),
    path.basename(__filename),
    defaultUnits(),
  );

export default getUnits;
