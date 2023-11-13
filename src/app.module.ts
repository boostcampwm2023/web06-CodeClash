import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoresModule } from './scores/scores.module';

@Module({
  imports: [ScoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
