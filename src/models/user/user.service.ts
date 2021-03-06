import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { sign } from 'jsonwebtoken';

import { User } from 'src/models/user/entities/user.entity';
import { AuthData } from 'src/models/auth/types/auth.types';
import { Types } from 'mongoose';
import { ID } from 'src/common/scalars/objectId.scalar';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
  ) {}

  findOne(_id: ID) {
    return this.userModel.findById(_id);
  }

  async generateRefreshToken(userId: ID, secret: string) {
    const refreshToken = sign(
      { _id: userId },
      secret,
      { expiresIn: '20d' },
    );

    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken
    });

    return refreshToken;
  }

  async upsertVKUser<User extends AuthData & { isBot?: boolean }>(
    {
      accessToken,
      isBot,
      profile: {
        name,
        id,
        photos,
        sex
      }
    }: User,
    onNewUser?: () => void
  ) {
    try {
      const user = await this.userModel.findOne({ 'social.vkProvider.id': id });

      if (!user) {
        if (onNewUser) {
          onNewUser();
        }
        return await this.userModel.create({
          name,
          isBot,
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

  findByIds(_ids: ID[]) {
    return this.userModel.find({'_id': { $in: _ids } }).exec();
  }
}
