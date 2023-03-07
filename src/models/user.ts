import mongoose, { Document } from 'mongoose';

export interface IUser {
  username: string;
  password: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// export type IUserModel = IUser & Document;
export interface IUserModel extends IUser, Document {}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUserModel>('User', UserSchema);
