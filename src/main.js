require('./scss/app.scss');

import Config from './config/GameConfig';
import UI from './modules/ui/UI';
import Application from './modules/Application';
let ui = new UI(window.document, Config);

let app = new Application(ui, Config);