import { Controller, Get, Query, Render } from '@nestjs/common';

type OAuthCode = {
  code: string;
}

@Controller('oauth')
export class AuthController {

  @Get('vk')
  @Render('oauth.pug')
  vkOAuthMessage(
    @Query() query: { code: string },
  ): OAuthCode {
    return {
      code: query.code,
    }
  }
}
