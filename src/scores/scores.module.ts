import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';

@Module({
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule {}
