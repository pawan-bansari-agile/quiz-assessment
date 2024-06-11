import { ApiProperty } from '@nestjs/swagger';

export class MarkIncompleteDto {
  @ApiProperty({ example: 1 })
  gameId: number;
}
