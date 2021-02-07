import { HttpService, Injectable } from '@nestjs/common';
import { AccessRightsUser, VKClient } from './vk.client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VkService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    ) {}

  vkClient = new VKClient(
    this.configService.get('vkConfig.clientID'),
    this.configService.get('vkConfig.clientSecret'),
    this.configService.get('vkConfig.callbackURL'),
    <T>(uri) => {
      return new Promise<T>((resolve, reject) => {
        return this.httpService.get<T>(uri).toPromise()
          .then(res => resolve(res.data))
          .catch(err => reject(err))
      });
    }
  );

  getOAuthUrl() {
    return this.vkClient.generateAuthUrl({
      display: 'page',
      response_type: 'code',
      scope: AccessRightsUser.photos
    })
  }

  async serializeAccountFromCode(code: string) {
    const { access_token, user_id } = await this.vkClient.getToken(code);
    const [user] = await this.vkClient.getUsers(
      access_token, [user_id], ['photo_id']);
    const userName = {
      familyName: user.last_name,
      givenName: user.first_name
    };

    const [photo] = await this.vkClient.getPhotosUrl(access_token, [user.photo_id]);
    return {
      accessToken: access_token,
      profile: {
        id: user_id,
        name: userName,
        photos: [{ url: photo.sizes[0].url }],
      },
    }
  }
}
