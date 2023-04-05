class Buffer {
    constructor(length) {
        this.nums = [];
        this.length = length;
    }

    /**
     * Вызывает метод pop() на this.nums
     * и возвращает удаленный элемент. Если массив пустой, то возвращает undefined
     * @return {number, undefined}
     */
    pop() {
        return this.nums.pop()
    }

    /**
     * Добавляет число в массив this.nums и располагает его напротив одинаковых чисел.
     * Если одинаковых нет, то ставит число в конец.
     * Если длина this.nums больше или равна this.length, то выдает ошибку.
     * @param n{number} число, которое надо добавить
     */
    add(n) {
        if (this.nums.length >= this.length) {
            throw new Error('Длина максимальна');
        }

        const index = this.nums.indexOf(n);

        if (index !== -1) {
            this.nums.splice(index, 0, n);
        } else {
            this.nums.push(n);
        }
    }

    /**
     * Находит все одинаковые числа идущие подряд в массиве this.nums и,
     * если их количество равно matchLength,
     * то удаляет эти числа.
     * @param matchLength{number} - минимальное количество одинаковых чисел для удаления
     */
    removeMatches(matchLength) {
        if (this.nums.length < matchLength) return

        let similarCount = 1;

        for (let i = 1; i < this.nums.length; i++) {
            if (this.nums[i] === this.nums[i - 1]) {
                similarCount++;
            } else {
                similarCount = 1;
            }
            if (similarCount >= matchLength) {
                this.nums.splice(i - matchLength + 1, matchLength)
                i = 0;
                similarCount = 1;
            }
        }
    }
}

module.exports = Buffer
