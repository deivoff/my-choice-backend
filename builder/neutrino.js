const path = require('path');
const node = require('@neutrinojs/node');
const airbnb = require('@neutrinojs/airbnb');
const images = require('@neutrinojs/image-loader');
const fonts = require('@neutrinojs/font-loader');

const nodeExternals = require('webpack-node-externals');
const terserPlugin = require('terser-webpack-plugin');

const resolveTsAliases = (tsconfigPath = './tsconfig.json') => (neutrino) => {
  const { paths } = require(tsconfigPath).compilerOptions;
  const aliasesFromTsConfig = Object.keys(paths).reduce((prevObj, key) => {
    const name = key.replace("/*", "");
    return {
      ...prevObj,
      [name]: path.resolve(paths[key][0].replace("/*", "")),
    };
  }, {});
  neutrino.config.resolve.alias
    .clear()
    .merge(aliasesFromTsConfig);
};

const eslintTypescript = neutrino => {
  neutrino.use(airbnb({
    test: neutrino.regexFromExtensions(['.ts']),
    eslint: {
      parser: "@typescript-eslint/parser",
      
      parserOptions: {
        ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',  // Allows for the use of imports
        project: './tsconfig.json',
        tsconfigRootDir: './'
      },
      baseConfig: {
        settings: {
          'import/parsers': {
            '@typescript-eslint/parser': ['.ts'],
          },
          'import/extensions': ['.ts', '.js'],
          "import/resolver": {
            "typescript": {}
          }
        },
        plugins: [
          '@typescript-eslint',
          'security',
          'import'
        ],
        extends:  [
          "airbnb-typescript",
          "plugin:@typescript-eslint/eslint-recommended",
          "plugin:@typescript-eslint/recommended",
          "plugin:@typescript-eslint/recommended-requiring-type-checking"
        ],
      },
      rules: require('./eslint.rules.js')
    }
  }));
};

const nodeTypescript = neutrino => {
  neutrino.config.optimization
    .minimizer('terser')
    .use(terserPlugin, [
      {
        parallel: true,
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }
    ]);
  neutrino.config.module
    .rule('typescript')
    .exclude
    .add(/node_modules/)
    .end()
    .test(/\.ts$/)
    .use('ts')
    .loader('ts-loader');
  neutrino.config.module
    .noParse(/\/_.+\.js$/);
  neutrino.config.resolve
    .extensions
    .merge(['.ts', '.js']);
  neutrino.config.externals([nodeExternals()])
};

module.exports = {
  use: [
    images(),
    fonts(),
    eslintTypescript,
    node({
      clean: true
    }),
    resolveTsAliases('./../tsconfig.json'),
    nodeTypescript,
  ],
};
