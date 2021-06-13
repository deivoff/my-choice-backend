enum Enable {
  on = 'on',
  off = 'off'
}

export type Secret = {
  access: string,
  secret: string,
}

export default () => {
  const {
    DB_URI,
    DB_NAME,
    DB_USER,
    DB_PASS,
    PORT = '3000',
    NODE_ENV,
    ORIGIN_URL,
    SSL,
    SECRET_ACCESS_KEY,
    SECRET_REFRESH_KEY,
    VK_CLIENT_ID,
    VK_CLIENT_SECRET,
    REDIS_URL,
    SENTRY_DSN,
  } = process.env;
  const isSSLEnable = Boolean(SSL) && SSL === Enable.on;

  const origin = {
    ws: (isSSLEnable ? 'wss://' : 'ws://') + ORIGIN_URL + '/',
    http: (isSSLEnable ? 'https://' : 'http://') + ORIGIN_URL + '/',
  };

  const secret = {
    refresh: SECRET_REFRESH_KEY,
    access: SECRET_ACCESS_KEY,
  }
  return ({
    port: parseInt(PORT, 10),
    secret,
    origin,
    redis: {
      url: REDIS_URL
    },
    database: {
      uri: DB_URI || '',
      dbName: DB_NAME || '',
      user: DB_USER || '',
      pass: DB_PASS || '',
    },
    isProd: NODE_ENV === 'production',
    env: NODE_ENV,
    sentry: {
      dsn: SENTRY_DSN,
    },
    vkConfig: {
      clientID: VK_CLIENT_ID,
      clientSecret: VK_CLIENT_SECRET,
      callbackURL: origin.http + 'oauth/vk'
    }
  });
};
