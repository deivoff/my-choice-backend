import { Controller, Get, Query } from '@nestjs/common';

@Controller('oauth')
export class AuthController {
  @Get('vk')
  vkOAuthMessage(
    @Query() query: { code: string },
  ) {
    return `
    <script>
    if (window.opener) {
      window.opener.postMessage(
      { source: 'auth', payload: { code: '${query.code}' } },
      '*'
      );
    }
    </script>
    `
  }
}
