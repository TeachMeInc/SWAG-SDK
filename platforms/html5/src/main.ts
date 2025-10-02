import './styles/main.scss';
import 'virtual:svg-to-font.css';

import config from '@/config';
import utils from '@/utils';
import APIWrapper from '@/APIWrapper';

utils.log('HTML5 SDK v' + config.version);
utils.log('For documentation, visit https://developers.shockwave.com/');

window.SWAGAPI = new APIWrapper();
