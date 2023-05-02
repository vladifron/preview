import { ApiProperty } from '@nestjs/swagger';

export class MessageSuccessResponse {
  @ApiProperty({
    type: String,
    example: 'Success',
  })
  message: string;
}