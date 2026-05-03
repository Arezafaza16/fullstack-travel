import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Prevents Render free-tier from spinning down the service
 * by pinging the health endpoint every 10 minutes.
 */
@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);
  private readonly appUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL;

  @Cron(CronExpression.EVERY_10_MINUTES)
  async ping() {
    if (!this.appUrl) {
      return; // Skip in local dev where no external URL is set
    }

    try {
      const res = await fetch(this.appUrl);
      this.logger.log(`Keep-alive ping → ${res.status}`);
    } catch (err) {
      this.logger.warn(`Keep-alive ping failed: ${err}`);
    }
  }
}
