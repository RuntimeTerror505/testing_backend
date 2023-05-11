import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CronService } from './cron/cron.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const cronService = app.get<CronService>(CronService);
  // cronService.checkExpiresStatuses();
  await app.listen(3000);
}
bootstrap();
