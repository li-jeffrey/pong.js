import * as Utils from "./utils.mjs";

const PADDLE_WIDTH = 5;
const PADDLE_HEIGHT = 80;
const PADDLE_X_PAD = 30;
const PADDLE_SPEED = 10;

const BALL_RADIUS = 5;
const BALL_MAX_SPEED = 5;

export default function (canvas) {
    var ctx = canvas.getContext('2d');
    var canvasW = canvas.width;
    var canvasH = canvas.height;
    var ball = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        v: BALL_MAX_SPEED,
        r: BALL_RADIUS
    }
    var leftPaddle = {
        x: 0,
        y: 0,
        v: PADDLE_SPEED,
        height: PADDLE_HEIGHT,
        width: PADDLE_WIDTH,
        score: 0
    }
    var rightPaddle = {
        x: 0,
        y: 0,
        v: PADDLE_SPEED,
        height: PADDLE_HEIGHT,
        width: PADDLE_WIDTH,
        score: 0
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '48px sans-serif';

    function placeBall(paddle) {
        ball.x = paddle == leftPaddle ? paddle.x + paddle.width + PADDLE_X_PAD : paddle.x - PADDLE_X_PAD;
        ball.y = paddle.y + paddle.height / 2;
        ball.vx = 0;
        ball.vy = 0;
    }

    function kickoff() {
        ball.vx = Utils.Random(ball.v * 0.5, ball.v * 0.8);
        ball.vx = ball.x < canvasW / 2 ? ball.vx : -ball.vx;

        ball.vy = Math.sqrt(Math.pow(ball.v, 2) - Math.pow(ball.vx, 2));
        ball.vy = Utils.FlipCoin() ? ball.vy : -ball.vy;
    }

    function placePaddle(paddle, x) {
        paddle.x = x;
        paddle.y = canvasH / 2 - paddle.height / 2;
    }

    function movePaddle(paddle, dy) {
        if (paddle.y + dy < 0) {
            return;
        }

        if (paddle.y + dy > canvasH - paddle.height) {
            return;
        }

        paddle.y += dy;
    }

    function movePaddleH(paddle, dx) {
        var newX = paddle.x + dx;
        if (paddle == leftPaddle) {
            newX = Math.min(newX, canvasW / 2 - paddle.width);
            newX = Math.max(newX, PADDLE_X_PAD);
        } else {
            newX = Math.max(newX, canvasW / 2);
            newX = Math.min(newX, canvasW - PADDLE_X_PAD - paddle.width);
        }

        paddle.x = newX;
    }

    function drawSeparator() {
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(canvasW / 2, 0);
        ctx.lineTo(canvasW / 2, canvasH);
        ctx.closePath();

        ctx.setLineDash([5, 15]);
        ctx.stroke();

        ctx.restore();
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawPaddle(paddle) {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    function drawScoreBoard() {
        ctx.fillText(leftPaddle.score, canvasW / 2 - 40, 10);
        ctx.fillText(rightPaddle.score, canvasW / 2 + 40, 10);
    }

    function clear() {
        ctx.clearRect(0, 0, canvasW, canvasH);
    }

    function moveBall() {
        var newX = Utils.Constrain(ball.x + ball.vx, ball.r, canvasW - ball.r);
        var newY = Utils.Constrain(ball.y + ball.vy, ball.r, canvasH - ball.r);

        // check collisions
        if (ball.vx > 0 &&
            newX + ball.r >= rightPaddle.x &&
            Utils.IsBetween(ball.y, rightPaddle.y, rightPaddle.y + rightPaddle.height)) {
            ball.vx = -ball.vx;
            newX = rightPaddle.x - ball.r;
        }

        if (ball.vx < 0 &&
            newX - ball.r <= leftPaddle.x + leftPaddle.width &&
            Utils.IsBetween(ball.y, leftPaddle.y, leftPaddle.y + leftPaddle.height)) {
            ball.vx = -ball.vx;
            newX = leftPaddle.x + leftPaddle.width + ball.r;
        }

        if (newY + ball.r == canvasH || newY - ball.r == 0) {
            ball.vy = -ball.vy;
        }

        ball.x = newX;
        ball.y = newY;
    }

    function render() {
        moveBall();
        if (ball.x - ball.r >= canvasW - PADDLE_X_PAD) {
            leftPaddle.score += 1;
            document.dispatchEvent(new CustomEvent('game-ended', { detail: { winner: leftPaddle } }));
            return;
        }

        if (ball.x + ball.r <= PADDLE_X_PAD) {
            rightPaddle.score += 1;
            document.dispatchEvent(new CustomEvent('game-ended', { detail: { winner: rightPaddle } }));
            return;
        }

        clear();
        drawBall();
        drawSeparator();
        drawPaddle(leftPaddle);
        drawPaddle(rightPaddle);
        drawScoreBoard();

        window.requestAnimationFrame(render);
    }

    function reset(side) {
        ctx.clearRect(0, 0, canvasW, canvasH);
        placePaddle(leftPaddle, PADDLE_X_PAD);
        placePaddle(rightPaddle, canvasW - PADDLE_X_PAD - rightPaddle.width);
        placeBall(side);
        render();
    }

    return {
        LeftPaddle: leftPaddle,
        RightPaddle: rightPaddle,
        Ball: ball,
        Reset: side => window.requestAnimationFrame(() => reset(side)),
        Start: kickoff,
        MovePaddleUp: paddle => movePaddle(paddle, -paddle.v),
        MovePaddleDown: paddle => movePaddle(paddle, paddle.v),
        MovePaddleLeft: paddle => movePaddleH(paddle, -paddle.v),
        MovePaddleRight: paddle => movePaddleH(paddle, paddle.v)
    }
}