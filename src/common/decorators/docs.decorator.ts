import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

import { TDocsType } from '@common/types';

export const Docs = (description: string, docsType: TDocsType) => {
  const isArray = Array.isArray(docsType);
  const type = isArray ? docsType[0] : docsType;

  return applyDecorators(
    ApiOperation({ description }),
    ApiOkResponse({ type, isArray }),
    ApiResponse({
      description: 'Critical error.',
      status: 500,
    }),
    ApiResponse({
      description: 'Invalid body or query.',
      status: 400,
    }),
  );
};
