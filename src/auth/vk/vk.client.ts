import { ParsedUrlQueryInput } from 'querystring';

const querystring = require('querystring');

  const enum OAuthMethods {
  authorize = 'authorize',
  accessToken = 'access_token',
}

const enum APIMethods {
  getUsers = 'users.get',
  getPhotosById = 'photos.getById'
}

type AuthURLParams = {
  display?: 'page' | 'popup' | 'mobile';
  scope?: AccessRightsUser[] | AccessRightsUser;
  response_type?: string;
  state?: string;
  revoke?: number;
}

type User<T extends keyof OptionalUser = never> = {
  id: number;
  first_name: string;
  last_name: string;
  is_closed: boolean;
  can_access_closed: boolean;
} & Pick<OptionalUser, T>;

type OptionalUser = {
  photo_id: string;
}

type Photo = {
  album_id: number;
  date: number;
  id: number;
  owner_id: number;
  has_tags: boolean;
  post_id: number;
  sizes: PhotoSize[];
}

type PhotoSize = {
  type: 's' | 'm' | 'x' | 'o' | 'p';
  url: string;
  width: number;
  height: number
}

export const enum AccessRightsUser {
  notify,
  friends,
  photos,
  audio,
  video,
  stories = 6,
  pages,
  add_link,
  status = 10,
  notes,
  messages,
  wall,
  ads = 15,
  offine,
  docs,
  groups,
  notifications,
  stats,
  email = 22,
  market = 27,
}

type Options = {
  oauthUrl: string;
  apiUrl: string;
  version: string;
}

export class VKClient {
  private readonly apiOptions: Options = {
    oauthUrl: 'https://oauth.vk.com/',
    apiUrl: 'https://api.vk.com/',
    version: '5.124',
  };

  constructor(
    private readonly clientId: string,
    private readonly secret: string,
    private readonly uri: string,
    private readonly getMethod: <T>(uri: string) => Promise<T>,
    apiOptions?: Partial<Options>
  ) {

    if (apiOptions) {
      this.apiOptions = {
        ...this.apiOptions,
        ...apiOptions,
      };
    }
  }

  private getOAuthMethod(method: OAuthMethods) {
    return this.apiOptions.oauthUrl + method
  }

  private getAPIMethod(method: APIMethods) {
    return this.apiOptions.apiUrl + 'method/' + method;
  }

  private toVKQueryString(obj: ParsedUrlQueryInput) {
    return querystring.stringify({ ...obj, v: this.apiOptions.version }, undefined, undefined, {
      encodeURIComponent: (str) => str,
    })
  }

  generateAuthUrl({
                    scope,
                    ...rest
                  }: AuthURLParams) {
    const url = this.getOAuthMethod(OAuthMethods.authorize);
    const scopeBitMask = scope ? Array.isArray(scope)
      ? scope.reduce<number>((acc, s) =>  (1 << s) + acc, 0)
      : 1 << scope
      : null;

    if (scopeBitMask) {
      return url + '?' + this.toVKQueryString({
        ...rest,
        client_id: this.clientId,
        redirect_uri: this.uri,
        scope: scopeBitMask,
      })
    }
    return url + '?' + this.toVKQueryString({
      ...rest,
      client_id: this.clientId,
      redirect_uri: this.uri,
    })
  }

  async getToken(code: string): Promise<{
    access_token: string;
    expires_in: number;
    user_id: number;
  }> {
    const uri = this.getOAuthMethod(OAuthMethods.accessToken);
    const query = this.toVKQueryString({
      code,
      client_secret: this.secret,
      redirect_uri: this.uri,
      client_id: this.clientId
    });
    return await this.getMethod(uri + '?' + query);
  }

  async getPhotosUrl(token: string, photos: string[]): Promise<Photo[]> {
    const uri = this.getAPIMethod(APIMethods.getPhotosById);
    const query = this.toVKQueryString({
      photos,
      access_token: token,
    });
    return await this.getMethod<{ response: Photo[] }>(uri + '?' + query).then(res => res.response);
  }

  async getUsers<T extends keyof OptionalUser = never>(token: string, userIds: number[], fields: T[]): Promise<(User<T>)[]> {
    const uri = this.getAPIMethod(APIMethods.getUsers);
    const query = this.toVKQueryString({
      user_ids: userIds,
      fields,
      access_token: token,
    });
    return await this.getMethod<{ response: User<T>[] }>(uri + '?' + query).then(res => res.response);
  }
}
