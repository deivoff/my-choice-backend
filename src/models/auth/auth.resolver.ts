import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { verify, decode } from 'jsonwebtoken';

import { VkService } from 'src/models/auth/vk/vk.service';
import { AuthRedirect, Tokens } from 'src/models/auth/types/auth.types';
import { UserService } from 'src/models/user/user.service';
import { ConfigService } from '@nestjs/config';

enum REGISTRATION_EXTRA {
  isBot = '1dBj3X'
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly vkService: VkService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Query(() => AuthRedirect)
  async getVKOAuthRedirect(): Promise<AuthRedirect> {
    return {
      url: this.vkService.getOAuthUrl()
    }
  }

  @Mutation(() => Tokens)
  async authVK(
    @Args('code') code: string,
    @Args('extra', { nullable: true }) extra: string,
  ): Promise<Tokens> {
    const { accessToken, profile } = await this.vkService.serializeAccountFromCode(
      code,
      'https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png'
    );

    const isBot = REGISTRATION_EXTRA.isBot === extra;
    const user = await this.userService.upsertVKUser({ accessToken, profile, isBot });
    const access = user.generateAccessJWT(this.configService.get<string>('secret.access') || '');
    const refresh = await this.userService.generateRefreshToken(
      user._id,
      this.configService.get<string>('secret.refresh') || ''
    );
    return {
      access,
      refresh,
    }
  }

  @Mutation(() => Tokens)
  async refreshTokens(
    @Args('oldTokens') oldTokens: Tokens
  ): Promise<Tokens> {
    verify(oldTokens.refresh, this.configService.get<string>('secret.refresh') || '')

    const { _id } = decode(oldTokens.refresh) as { _id: string }
    const user = await this.userService.findOne(_id);

    if (user?.refreshToken !== oldTokens.refresh) {
      throw new Error('Wrong refresh token!')
    }

    const access = user.generateAccessJWT(this.configService.get<string>('secret.access') || '');
    const refresh = await this.userService.generateRefreshToken(
      user._id,
      this.configService.get<string>('secret.refresh') || ''
    );

    return {
      access,
      refresh
    }
  }
}
