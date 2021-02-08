export default () => {
  const {
    DB_URI,
    DB_NAME,
    DB_USER,
    DB_PASS,
    PORT,
    NODE_ENV,
    ORIGIN_URL,
    WS_ORIGIN_URL,
    SECRET_KEY,
    VK_CLIENT_ID,
    VK_CLIENT_SECRET,
  } = process.env;
  return ({
    port: parseInt(PORT, 10) || 3000,
    secretKey: SECRET_KEY,
    origin: {
      ws: WS_ORIGIN_URL,
      http: ORIGIN_URL,
    },
    database: {
      uri: DB_URI,
      dbName: DB_NAME,
      user: DB_USER,
      pass: DB_PASS,
    },
    isProd: NODE_ENV === 'production',
    vkConfig: {
      clientID: VK_CLIENT_ID,
      clientSecret: VK_CLIENT_SECRET,
      callbackURL: ORIGIN_URL + 'oauth/vk'
    }
  });
};
