class Matrix {
    constructor(parsedCsvArray) {
        this.size = parsedCsvArray.length;
        this.data = new Array(parsedCsvArray.length ** 2);
        let index = 0;
        for (let i = 0; i !== parsedCsvArray.length; i++) {
            for (let prop in parsedCsvArray[i]) {
                this.data[index++] = {
                    row: i,
                    col: parseInt(prop),
                    value: parseInt(parsedCsvArray[i][prop])
                };
            }
        }
    }

    print() {
        const matrix = new Array(this.size);
        for (let i = 0; i !== this.size; i++) {
            matrix[i] = new Array(this.size);
        }
        this.data.forEach((elem) => {
            matrix[elem.row][elem.col] = (elem.inGroup) ? '▒' : elem.value;
        });
        console.table(matrix);
    }

//------------------------------ Task 1.1 ------------------------------
    getElem(i, j) {
        return this.data.find((elem) => {
            if (elem.row === i && elem.col === j) {
                return true;
            }
        }).value;
    }

    getRowsSums() {
        const sumVector = new Map();
        this.data.forEach((elem) => {
            if (!elem.inGroup) {
                if (sumVector.has(elem.row)) {
                    const value = sumVector.get(elem.row);
                    sumVector.set(elem.row, value + elem.value);
                } else {
                    sumVector.set(elem.row, elem.value);
                }
            }
        });
        return sumVector;
    }

    excludeInternalDependencies() {
        for (let [keyI, valueI] of this.deltaVector) {
            let internalDepSum = 0;
            for (let [keyJ, valueJ] of this.deltaVector) {
                let value = this.getElem(keyI, keyJ);
                internalDepSum += value;
            }
            this.deltaVector.set(keyI, valueI - internalDepSum);
        }
    }

    reduceDeltaVector() {
        let maxLinkedVertex = this.deltaVector.keys().next().value;
        this.deltaVector.forEach((value, key, map) => {
            if (value > map.get(maxLinkedVertex)) {
                maxLinkedVertex = key;
            }
        });
        this.deltaVector.forEach((value, key, map) => {
            let externalDepCount = this.getElem(key, maxLinkedVertex);
            map.set(key, value + externalDepCount);
        });
        this.deltaVector.delete(maxLinkedVertex);
    }

    excludeGroup(group) {
        for (let i = 0; i !== this.size * this.size; i++) {
            group.forEach((value, key) => {
                if (key === this.data[i].col || key === this.data[i].row) {
                    this.data[i].inGroup = true;
                }
            });
        }
    }

    resetGroups() {
        this.data.forEach((elem) => {
            elem.inGroup = false;
        });
    }

    getDeltaVector(containerSize) {
        const sumVector = this.getRowsSums();
        let minLinkedVertex = sumVector.keys().next().value;
        sumVector.forEach((value, key, map) => {
            if (value < map.get(minLinkedVertex)) {
                minLinkedVertex = key;
            }
        });
        this.deltaVector = new Map();
        this.deltaVector.set(minLinkedVertex, sumVector.get(minLinkedVertex));
        this.data.forEach((elem) => {
            if (elem.row === minLinkedVertex && elem.value !== 0 && !elem.inGroup) {
                this.deltaVector.set(elem.col, sumVector.get(elem.col));
            }
        });
        while (this.deltaVector.size < containerSize) {
            for (let [key, value] of sumVector) {
                if (!this.deltaVector.has(key)) {
                    this.deltaVector.set(key, value);
                    if (this.deltaVector.size === containerSize) {
                        break;
                    }
                }
            }
        }
        this.excludeInternalDependencies(this.deltaVector);
        while (this.deltaVector.size > containerSize) {
            this.reduceDeltaVector(this.deltaVector);
        }
        this.excludeGroup(this.deltaVector);
        return this.deltaVector;
    }

//------------------------------ End Task 1.1 ------------------------------

//------------------------------ Task 1.2 ------------------------------
//------------------------------ End Task 1.2 ------------------------------
}


module.exports = Matrix;
