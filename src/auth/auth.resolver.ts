import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VkService } from './vk/vk.service';
import { AuthRedirect, AuthResponse } from './types/auth.types';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

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
  ): Promise<AuthResponse> {
    const { accessToken, profile } = await this.vkService.serializeAccountFromCode(code);

    const user = await this.userService.upsertVKUser({ accessToken, profile });
    const token = user.generateJWT(this.configService.get<string>('secretKey') || '');
    return {
      token
    }
  }
}
