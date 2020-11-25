import configDev from './config.dev';
import configProd from './config.prod';

const conf = {
  thumbSuffix: '_yasuo.jpg',
};

const config =
  process.env.NODE_ENV === 'development' ? { ...configDev, ...conf } : { conf, ...configProd };
export default config;
