import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan, Repository } from 'typeorm';
import { Post } from './posts/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostCleanupService {
  private readonly logger = new Logger(PostCleanupService.name);

  constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>) {}

  @Cron(CronExpression.EVERY_HOUR)
  async deleteExpiredPosts() {
    try {
      const now = new Date();
      const deleteResult = await this.postRepository.delete({
        expires_at: LessThan(now),
      });

      this.logger.log(
        `Deleted ${deleteResult.affected} expired posts at ${now.toISOString()}`,
      );
    } catch (error) {
      this.logger.error('Error deleting expired posts', error.stack);
    }
  }
}
