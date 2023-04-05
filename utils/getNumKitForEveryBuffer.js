/**
 * Принимает набор чисел и количество.
 * Формирует из данного набора в случайном порядке матрицу размером: amount x digits.length.
 * В каждой строке возвращаемой матрицы, не может быть больше 2 повторяемых чисел.
 * @param digits{number[]} - набор чисел из которых, будет сформирован возвращаемый набор чисел
 * @param amount{number} - количество наборов чисел, которые надо вернуть
 * @return {number[][]}
 */
function getNumKitForEveryBuffer(digits, amount) {

    // Содержит в себе весь возможный набор чисел
    const pool = [];
    // Содержит в себе подходящие наборы чисел из pool для разных буферов
    const poolForEveryBuffer = []

    // Заполнение pool и создание массивов для наборов чисел в poolForEveryBuffer
    for (let i = 0; i < amount; i++) {
        pool.push(...digits);
        poolForEveryBuffer.push([])
    }
    // Случайная сортировка pool. Без неё последнее число в pool,
    // обязательно будет первым числом в каком либо массиве
    pool.sort(() => Math.random() - 0.5)


    for (let i = 0; i < digits.length * amount; i++) {

        // Индекс случайного массива в poolForEveryBuffer
        const index = Math.floor(Math.random() * poolForEveryBuffer.length);

        // Проверка, что массив с индексом index в poolForEveryBuffer,
        // содержит в себе более двух чисел pool[pool.length - 1]
        // или, что данный массив заполнен.
        if (
            poolForEveryBuffer[index].filter(num => num === pool[pool.length - 1]).length >= 2 ||
            poolForEveryBuffer[index].length >= digits.length
        ) {

            // Состояние бесконечности указывает, зациклился ли код
            let isInfinity = true;

            // Если существует больше одного незаполненного массива в poolForEveryBuffer,
            // то код не зациклился.
            poolForEveryBuffer.forEach((nums, j) => {
                if (j === index) return

                if (nums.length < digits.length) {
                    isInfinity = false
                }
            })

            // Если код зациклен, то из первого полного массива в poolForEveryBuffer
            // выдергивается элемент и возвращается в пул.
            if (isInfinity) {
                pool.push(poolForEveryBuffer.filter(nums => nums.length >= digits.length)[0].pop());
                // i уменьшается на 1 так как pool.length увеличилось на 1
                i--;
            }

            // Так как текущий index нам не подходит,
            // то проходим текущую итерацию до тех пор, пока index не будет удовлетворительным
            i--;
            continue;
        }

        // Выдергиваем из pool элемент и вставляем в poolForEveryBuffer[index]
        poolForEveryBuffer[index].push(pool.pop())
    }

    return poolForEveryBuffer;
}

module.exports = getNumKitForEveryBuffer;