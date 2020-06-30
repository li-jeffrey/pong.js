export const Keys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    W: 87,
    S: 83,
    A: 65,
    D: 68
}

export function Constrain(x, min, max) {
    if (x < min) {
        return min;
    }

    if (x > max) {
        return max;
    }

    return x;
}

export function Random(min, max) {
    return min + Math.random() * (max - min);
}

export function IsBetween(x, lower, upper) {
    return x >= lower && x <= upper
}

export function FlipCoin() {
    return Math.random() >= 0.5;
}