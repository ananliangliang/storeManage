import configDev from './config.dev';
import configProd from './config.prod';

const config = process.env.NODE_ENV === 'development' ? configDev : configProd;
export default config;
