import configDev from './config.dev';
import configProd from './config.prod';
import configPreview from './config.preview';

const conf = {
  thumbSuffix: '_yasuo.jpg',
  ident: 'tools',
  noAuthPage: ['/user/login', '/charts'],
};

// eslint-disable-next-line import/no-mutable-exports
let config: any = {};

switch (REACT_APP_ENV) {
  case 'dev':
    config = { ...configDev, ...conf };
    break;
  case 'preview':
    config = { ...configPreview, ...conf };
    break;
  case 'prod':
    config = { ...configProd, ...conf };
    break;

  default:
    break;
}

export default config;
