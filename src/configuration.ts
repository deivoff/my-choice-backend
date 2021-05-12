enum Enable {
  on = 'on',
  off = 'off'
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
    SECRET_KEY,
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
  return ({
    port: parseInt(PORT, 10),
    secretKey: SECRET_KEY,
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
