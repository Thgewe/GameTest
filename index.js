/*
* 1 1 1 2 2 2 3 3 3 4 4 4 5 5 5
* ? Убрать рекурсию из removeMatches
* ? Добавим класс Game, который будет внутри себя создавать 3 Buffer с length = 7 в которе, игра положит по 5 цифр от 1 до 5 такие,
* чтобы на все Buffer было всех цифр от 1 до 5 по 3 штуки. Так, чтобы ни в одном Buffer не было ни одного матча длины 3.
* У Game будет бесконечный цикл игры. В этом цикле, игра должна удалять из одного Buffer элемент, и добавлять его в другой, используя методы
* */
const Game = require('./class/Game');

const testPool1 = [
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
]
const testPool2 = [
    [1, 3, 5, 2, 4],
    [2, 4, 1, 3, 5],
    [5, 3, 1, 4, 2],
]
const testPool3 = [
    [1, 1, 2, 2, 3],
    [3, 4, 4, 5, 5],
    [1, 2, 3, 4, 5],
]
const testPool4 = [
    [1, 1, 2, 2, 3],
    [3, 3, 4, 4, 5],
    [5, 5, 1, 2, 4],
]
const testPool5 = [
    [5, 4, 3, 2, 1],
    [1, 2, 3, 4, 5],
    [5, 1, 4, 3, 2],
]
const testPool6 = [
    [5, 4, 3, 2, 1],
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
]

const game = new Game()

game.start()