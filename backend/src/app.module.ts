import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from './auth/auth.controller';
import { PostsController } from './posts/posts.controller';
import { UsersController } from './users/users.controller';
import { PostsProcessor } from './posts/posts.processor';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { JwtStrategy } from './auth/jwt.strategy';
import { User, UserSchema } from './schemas/user.schema';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/social-app'),
    BullModule.forRoot({ connection: { host: 'localhost', port: 6379 } }),
    BullModule.registerQueue({ name: 'posts-queue' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    PassportModule,
    JwtModule.register({ secret: 'SECRET_KEY_HERE', signOptions: { expiresIn: '1h' } }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [AuthController, PostsController, UsersController],
  providers: [
    PostsProcessor,
    NotificationsGateway,
    JwtStrategy,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}