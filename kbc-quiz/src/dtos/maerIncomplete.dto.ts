import { ApiProperty } from '@nestjs/swagger';

export class MarkIncompleteDto {
  @ApiProperty()
  gameId: number;
}
