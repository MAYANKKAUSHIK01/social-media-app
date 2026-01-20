import { Controller, Post, Get, Body, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post as PostSchema } from '../schemas/post.schema';
import { User } from '../schemas/user.schema';
import { Throttle } from '@nestjs/throttler';

@Controller('posts')
export class PostsController {
  constructor(
    @InjectQueue('posts-queue') private postsQueue: Queue,
    @InjectModel(PostSchema.name) private postModel: Model<PostSchema>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  async create(@Request() req, @Body() body: any) {
    await this.postsQueue.add('create-post', {
      ...body,
      author: req.user.userId,
    });
    return { message: 'Post queued' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('timeline')
  async getTimeline(@Request() req) {
    const currentUser = await this.userModel.findById(req.user.userId);

    // FIX ADDED HERE: Check if user exists before accessing properties
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    return this.postModel.find({
      author: { $in: [...currentUser.following, currentUser._id] }
    })
    .sort({ createdAt: -1 })
    .populate('author', 'username')
    .exec();
  }
}