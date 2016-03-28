import Game from './modules/game/Game';
import Config from './config/GameConfig';
import UI from './modules/ui/UI';

var game = new Game(Config);
var ui = new UI(window.document);

ui.on('ready', () => {
    game.start(Config)
});

game.on('stateChange', (args) => {
    console.log(args);
});

game.on('discover', (field) => {
   console.log('Discovering field', field);
});

setTimeout(() => {
    game.discover(0, 0)
}, 1000);