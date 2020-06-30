import Init from './game.mjs';
import { SinglePlayer } from './control.mjs';
import { DoublePlayer } from './control.mjs';

window.onload = () => {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var game = Init(canvas);
        // DoublePlayer(game);
        SinglePlayer(game);
    }
}