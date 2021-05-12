import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VkService } from 'src/models/auth/vk/vk.service';
import { AuthRedirect, AuthResponse } from 'src/models/auth/types/auth.types';
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

  @Mutation(() => AuthResponse)
  async authVK(
    @Args('code') code: string,
    @Args('extra', { nullable: true }) extra: string,
  ): Promise<AuthResponse> {
    const { accessToken, profile } = await this.vkService.serializeAccountFromCode(
      code,
      'https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png'
    );

    const isBot = REGISTRATION_EXTRA.isBot === extra;
    const user = await this.userService.upsertVKUser({ accessToken, profile, isBot });
    const token = user.generateJWT(this.configService.get<string>('secretKey') || '');
    return {
      token
    }
  }
}
