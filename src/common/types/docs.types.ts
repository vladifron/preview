import { ApiResponseMetadata } from '@nestjs/swagger/dist/decorators/api-response.decorator';

export type TDocsType = ApiResponseMetadata['type'] | string[];
