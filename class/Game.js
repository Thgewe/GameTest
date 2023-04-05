const Buffer = require('./Buffer');
const getNumKitForEveryBuffer = require('../utils/getNumKitForEveryBuffer');

class Game {

    constructor(testPool) {
        this.buffers = [];
        // Количество чисел для матча
        this.matchQuantity = 3;
        // Содержит в себе весь возможный набор чисел
        const digitsPool = [1, 2, 3, 4, 5];
        // Содержит в себе подходящие наборы чисел для разных буферов
        // Если передан тестовый набор testPool, то в качестве pool используется он.
        // Если нет, то pool генерируется случайным образом.
        const pool = testPool
            ? testPool
            : getNumKitForEveryBuffer(digitsPool, 3);

        // Создание трёх Buffer c length = 7 и заполнение их
        for (let i = 0; i < 3; i++) {
            const newBuffer = new Buffer(7);

            for (let j = 0; j < digitsPool.length; j++) {
                newBuffer.add(pool[i][j])
            }

            this.buffers.push(newBuffer);
        }
    }

    start() {
        const loop = () => {

            console.log('//////////////////////////////////////////////////////////////')
            // Массив, который хранит последнее число в буфере и количество одинаковых чисел в конце.
            // Длина этого массива всегда равна количеству буферов.
            // lastNumInBuffer[i] соответствует this.buffers[i].
            const lastNumInBuffer = []

            // Состояние, которое определяет - было ли изменение какого либо буфера
            let isChanged = false;

            // заполняет массив lastNumInBuffer
            for (let i = 0; i < this.buffers.length; i++) {
                console.log(this.buffers[i].nums)

                // Проверка, что буфер не пустой.
                // Если пустой, то в lastNumInBuffer добавляется объект с нулевыми данными
                if (this.buffers[i].nums.length <= 0) {
                    lastNumInBuffer.push({num: null, quantity: 0})
                    continue
                }

                // последнее число в буфере
                const lastNum = this.buffers[i].nums[this.buffers[i].nums.length - 1];
                // количество одинаковых чисел в конце буфера
                let quantity = 1;
                // индекс соседнего числа
                let neighbourNumIndex = this.buffers[i].nums.length - 2;

                // вычисляю, сколько в конце одинаковых чисел подряд
                while (
                    typeof this.buffers[i].nums[neighbourNumIndex] !== 'undefined' &&
                    this.buffers[i].nums[neighbourNumIndex] === lastNum
                ) {
                    quantity++;
                    neighbourNumIndex--;
                }

                // в lastNumInBuffer пушу объект,
                // содержащий последнее число буфера и количество одинаковых чисел в конце
                lastNumInBuffer.push({num: lastNum, quantity: quantity})
            }

            // Тут все буферы и им соответствующие lastNumInBuffer сравниваются друг с другом
            // цикл, пробегающийся по всем буферам
            // currentIndex - это индекс текущего буфера с которым сравниваются остальные
            for (let currentIndex = 0; currentIndex < this.buffers.length; currentIndex++) {
                // проверка, что текущий буфер не пуст
                if (this.buffers[currentIndex].nums.length <= 0) continue

                // Цикл, пробегающийся по буферам для сравнения с текущим
                // compareToIndex - это индекс буфера, с которым сравнивается текущий.
                // Далее "текущий буфер" = "текущий", а "буфер с которым сравнивается текущий" = "сравниваемый"
                for (let compareToIndex = 0; compareToIndex < this.buffers.length; compareToIndex++) {

                    // проверка, что мы не сравниваем текущий с текущим
                    if (currentIndex === compareToIndex) continue
                    // проверка, что сравниваемый, не пуст
                    if (this.buffers[compareToIndex].nums.length <= 0) continue

                    // Проверка последнего числа текущего на равенство к последнему числу сравниваемого
                    if (lastNumInBuffer[currentIndex].num === lastNumInBuffer[compareToIndex].num) {
                        // Проверка, что количество одинаковых чисел в конце текущего больше
                        // количества одинаковых чисел в конце сравниваемого и, что сумма вторых
                        // с количеством чисел в текущем не превысит максимальной длины текущего
                        if (
                            lastNumInBuffer[currentIndex].quantity > lastNumInBuffer[compareToIndex].quantity &&
                            this.buffers[currentIndex].nums.length + lastNumInBuffer[compareToIndex].quantity
                                <= this.buffers[currentIndex].length
                        ) {
                            // Так как условие прошло, то
                            // выдергиваем все последние одинаковые числа из сравниваемого
                            // и вставляем их в текущий
                            while (lastNumInBuffer[compareToIndex].quantity > 0) {
                                const poppedNum = this.buffers[compareToIndex].pop();
                                // Вывод в консоль:
                                // Num - число, которое выдернули.
                                // From - индекс буфера из которого выдернули число.
                                // To - индекс буфера в который вставили выдернутое число.
                                console.log('Num: ' + poppedNum + ' From: ' + compareToIndex + ' To: ' + currentIndex);
                                this.buffers[currentIndex].add(poppedNum);
                                lastNumInBuffer[currentIndex].quantity++;
                                lastNumInBuffer[compareToIndex].quantity--;
                            }
                            // Проверяем, равно или больше ли количество одинаковых элементов в конце чем matchQuantity.
                            // Если да, то вызываем метод removeMatches на текущем
                            if (lastNumInBuffer[currentIndex].quantity >= this.matchQuantity) {
                                this.buffers[currentIndex].removeMatches(this.matchQuantity);
                                lastNumInBuffer[currentIndex].quantity = 0;
                                // Вывод в консоль индекса буфера на котором вызван removeMatches
                                console.log('RemoveMatches in buffer: ' + currentIndex)
                            }
                            // Указываем, что изменения в каком-то буфере произошли
                            isChanged = true;
                        } else {
                            // Так как условие не прошло, то
                            // выдергиваем последние одинаковые числа из текущего
                            // и вставляем их в сравниваемый до тех пор,
                            // пока не закончатся такие числа в текущем или сравниваемый не заполнится
                            while (
                                lastNumInBuffer[currentIndex].quantity > 0 &&
                                this.buffers[compareToIndex].nums.length <= this.buffers[compareToIndex].length
                            ) {
                                const poppedNum = this.buffers[currentIndex].pop();
                                // Вывод в консоль:
                                // Num - число, которое выдернули.
                                // From - индекс буфера из которого выдернули число.
                                // To - индекс буфера в который вставили выдернутое число.
                                console.log('Num: ' + poppedNum + ' From: ' + currentIndex + ' To: ' + compareToIndex);
                                this.buffers[compareToIndex].add(poppedNum);
                                lastNumInBuffer[currentIndex].quantity--;
                                lastNumInBuffer[compareToIndex].quantity++;
                            }
                            // Проверяем, равно или больше ли количество одинаковых элементов в конце чем matchQuantity.
                            // Если да, то вызываем метод removeMatches на сравниваемом
                            if (lastNumInBuffer[compareToIndex].quantity >= this.matchQuantity) {
                                this.buffers[compareToIndex].removeMatches(this.matchQuantity);
                                lastNumInBuffer[compareToIndex].quantity = 0;
                                console.log('RemoveMatches in buffer: ' + compareToIndex)
                            }
                            // Указываем, что изменения в каком-то буфере произошли
                            isChanged = true;
                        }

                    // Если первая проверка на равенство последних чисел не прошла.
                    // Тогда проверка, есть ли последнее число текущего в сравниваемом.
                    } else if (this.buffers[compareToIndex].nums.includes(lastNumInBuffer[currentIndex].num)) {
                        // Проверка, что сумма количества одинаковых последних чисел в текущем
                        // с количеством чисел в сравниваемом меньше максимальной длины сравниваемого
                        if (
                            lastNumInBuffer[currentIndex].quantity + this.buffers[compareToIndex].nums.length
                                <= this.buffers[currentIndex].length
                        ) {
                            // Так как условие прошло, то
                            // выдергиваем последние одинаковые числа из текущего
                            // и вставляем в сравниваемый
                            while (lastNumInBuffer[currentIndex].quantity > 0) {
                                const poppedNum = this.buffers[currentIndex].pop();
                                // Вывод в консоль:
                                // Num - число, которое выдернули.
                                // From - индекс буфера из которого выдернули число.
                                // To - индекс буфера в который вставили выдернутое число.
                                console.log('Num: ' + poppedNum + ' From: ' + currentIndex + ' To: ' + compareToIndex);
                                this.buffers[compareToIndex].add(poppedNum);
                                lastNumInBuffer[currentIndex].quantity--;
                            }
                            // Указываем, что изменения в каком-то буфере произошли
                            isChanged = true;

                        // Условие не прошло => сравниваемый заполнен.
                        // Тогда выдергиваем последнее число из текущего и сохраняем его в константу.
                        // Потом выдергиваем число из сравниваемого и вставляем в текущий.
                        // Потом вставляем сохраненное число в сравниваемый.
                        } else {
                            const poppedNumCurrent = this.buffers[currentIndex].pop();
                            const poppedNumCompare = this.buffers[compareToIndex].pop();
                            this.buffers[currentIndex].add(poppedNumCompare);
                            this.buffers[compareToIndex].add(poppedNumCurrent);
                            console.log(
                                'Exchange: ' + currentIndex + ' - ' + compareToIndex +
                                ' Num1: ' + poppedNumCurrent + ' Num2: ' + poppedNumCompare
                            )
                            // Указываем, что изменения в каком-то буфере произошли
                            isChanged = true;
                        }
                    }
                }
            }

            if (!isChanged) {
                // Если не произошло никаких изменений и какой-либо буфер не пустой,
                // то это значит, что нет больше ходов.
                // Иначе, игра завершена.
                if (this.buffers.some((buf) => buf.nums.length > 0)) {
                    console.log('Нет возможных ходов');
                } else {
                    console.log('Готов');
                }
            } else {
                // Удаляет все матчи
                this.buffers.forEach(buf => buf.removeMatches(this.matchQuantity))
            }

            // Зацикливание с задержкой 500мс
            setTimeout(() => {
                loop();
            }, 500)
        }

        loop();
    }
}

module.exports = Game;
