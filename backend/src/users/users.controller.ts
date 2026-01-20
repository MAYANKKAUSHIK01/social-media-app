import { Controller, Post, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private notificationsGateway: NotificationsGateway
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':username/follow') // Changed from :id to :username
  async follow(@Param('username') targetUsername: string, @Request() req) {
    const currentUserId = req.user.userId;

    // 1. Find the user we want to follow by their NAME
    const targetUser = await this.userModel.findOne({ username: targetUsername });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const targetId = targetUser._id;

    // 2. Perform the Follow
    await this.userModel.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetId } });
    await this.userModel.findByIdAndUpdate(targetId, { $addToSet: { followers: currentUserId } });

    // 3. Send Notification
    this.notificationsGateway.notifyUser(targetId.toString(), `User ${req.user.username} followed you!`);
    
    return { message: `You are now following ${targetUsername}` };
  }
}