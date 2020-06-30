import { Keys, FlipCoin } from './utils.mjs';

export function DoublePlayer(game) {
    var starter = FlipCoin() ? game.RightPaddle : game.LeftPaddle;
    var registerKey = (key, source, action) => {
        document.addEventListener('keydown', e => {
            if (e.keyCode == key) {
                if (starter == source) {
                    starter = null;
                    game.Start();
                }

                action(source);
            }
        })
    }

    document.addEventListener('game-ended', e => {
        starter = e.detail.winner;
        starter.height = Math.min(10, starter.height - 10);
        starter.v += 2;
        game.Ball.v += 2;
        game.Reset(starter);
    })

    registerKey(Keys.UP, game.RightPaddle, game.MovePaddleUp);
    registerKey(Keys.DOWN, game.RightPaddle, game.MovePaddleDown);
    // registerKey(Keys.LEFT, game.RightPaddle, game.MovePaddleLeft);
    // registerKey(Keys.RIGHT, game.RightPaddle, game.MovePaddleRight);
    registerKey(Keys.W, game.LeftPaddle, game.MovePaddleUp);
    registerKey(Keys.S, game.LeftPaddle, game.MovePaddleDown);
    // registerKey(Keys.A, game.LeftPaddle, game.MovePaddleLeft);
    // registerKey(Keys.D, game.LeftPaddle, game.MovePaddleRight);

    game.Reset(starter);
}

export function SinglePlayer(game) {
    var starter = FlipCoin() ? game.RightPaddle : game.LeftPaddle;

    var ai;
    var makeDecision = () => {
        if (starter == game.RightPaddle) {
            starter = null;
            game.Start();
        }

        if (game.Ball.y > game.RightPaddle.y + game.RightPaddle.height / 2) {
            game.MovePaddleDown(game.RightPaddle);
        } else if (game.Ball.y < game.RightPaddle.y + game.RightPaddle.height / 2) {
            game.MovePaddleUp(game.RightPaddle);
        }
        ai = setTimeout(makeDecision, 100);
    }

    document.addEventListener('game-ended', e => {
        clearTimeout(ai);
        starter = e.detail.winner;
        game.Reset(starter);
        setTimeout(makeDecision, 500);
    })

    var registerKey = (key, source, action) => {
        document.addEventListener('keydown', e => {
            if (e.keyCode == key) {
                if (starter == source) {
                    starter = null;
                    game.Start();
                }

                action(source);
            }
        })
    }

    registerKey(Keys.UP, game.LeftPaddle, game.MovePaddleUp);
    registerKey(Keys.DOWN, game.LeftPaddle, game.MovePaddleDown);

    game.Reset(starter);
    ai = setTimeout(makeDecision, 500);
}