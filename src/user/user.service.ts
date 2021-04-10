import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { User } from 'src/user/entities/user.entity';
import { AuthData } from 'src/auth/types/auth.types';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
  ) {}

  findOne(_id: Types.ObjectId | string) {
    return this.userModel.findById(_id);
  }

  async upsertVKUser<User extends AuthData>({ accessToken, profile: {
    name, id, photos, sex
  } }: User, onNewUser?: () => void) {
    try {
      const user = await this.userModel.findOne({ 'social.vkProvider.id': id });

      if (!user) {
        if (onNewUser) {
          onNewUser();
        }
        return await this.userModel.create({
          name,
          // @ts-ignore
          'social.vkProvider': {
            id,
            token: accessToken,
          },
          photos,
        });
      }

      user.photos = photos;
      user.sex = user.sex || sex;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  updateNickname(userId: Types.ObjectId, newNickname: string) {
    return this.userModel.findByIdAndUpdate(userId, {
      _nickname: newNickname,
    }, { new: true });
  }

  findMany(_ids: Types.ObjectId[]) {
    return this.userModel.find({'_id': { $in: _ids } });
  }
}
