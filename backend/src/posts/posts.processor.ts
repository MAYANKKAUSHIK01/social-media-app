import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schemas/post.schema';

@Processor('posts-queue')
export class PostsProcessor extends WorkerHost {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {
    super();
  }

  async process(job: Job): Promise<any> {
    const newPost = new this.postModel(job.data);
    await newPost.save();
    console.log(`[Queue] Post created: ${newPost.title}`);
  }
}