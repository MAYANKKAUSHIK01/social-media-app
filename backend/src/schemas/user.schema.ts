import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true }) username: string;
  @Prop({ required: true }) passwordHash: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] }) following: Types.ObjectId[];
}
export const UserSchema = SchemaFactory.createForClass(User);