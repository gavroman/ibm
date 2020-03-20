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

    getElem(i, j) {
        return this.data.find((elem) => {
            if (elem.row === i && elem.col === j) {
                return true;
            }
        }).value;
    }

    getRowsSums() {
        const sumVector = new Array(this.size).fill(0);
        this.data.forEach((elem) => {
            sumVector[elem.row] += elem.value;
        });
        return sumVector;
    }

    getRowsSums2() {
        const sumVector = [];
        this.data.forEach((elem) => {
            if (!elem.inGroup) {
                let vectorHasElem = false;
                for (let sumVectorElem of sumVector) {
                    if (sumVectorElem.row === elem.row) {
                        vectorHasElem = true;
                        sumVectorElem.value += elem.value;
                        break;
                    }
                }
                if (!vectorHasElem) {
                    sumVector.push({
                        row: elem.row,
                        value: elem.value
                    });
                }
            }
        });
        return sumVector;
    }

    excludeInternalDependencies(vector) {
        for (let i = 0; i !== vector.length; i++) {
            let internalDepSum = 0;
            for (let j = 0; j !== vector.length; j++) {
                let value = this.getElem(vector[i].col, vector[j].col);
                internalDepSum += value;
            }
            vector[i].value -= internalDepSum;
        }
    }

    getDeltaVector() {
        // const sumVector = this.getRowsSums();
        const sumVector2 = this.getRowsSums2();

        console.table(sumVector2);

        let minLinkedVertexIndex = 0;
        for (let i = 0; i !== sumVector2.length; i++) {
            if (sumVector2[i].value < sumVector2[minLinkedVertexIndex].value) {
                minLinkedVertexIndex = i;
            }
        }
        const minLinkedVertex2 = sumVector2[minLinkedVertexIndex];
        // const minLinkedVertex = sumVector.indexOf(Math.min(...sumVector));
        
        const deltaVector = [];
        deltaVector.push({
            col: minLinkedVertex2.row,
            value: minLinkedVertex2.value,
        });
        this.data.forEach((elem) => {
            if (elem.row === minLinkedVertex2.row && elem.value !== 0) {
                let linksAmount = '.|.';
                console.log('+++');
                for (let i = 0; i !== sumVector2.length; i++) {
                    if (sumVector2[i].row === elem.row) {
                        linksAmount = sumVector2[i].value;
                        console.log('ZALUPA', sumVector2[i]);
                    }
                }
                deltaVector.push({
                    col: elem.col,
                    value : linksAmount
                });
            }
        });
        this.excludeInternalDependencies(deltaVector);
        return deltaVector;
    }

    reduceDeltaVector(deltaVector) {
        // find max
        let maxElemIndex = 0;
        deltaVector.forEach((elem, index) => {
            if (deltaVector[maxElemIndex].value < elem.value) {
                maxElemIndex = index;
            }
        });
        // fix external dependencies
        for (let i = 0; i !== deltaVector.length; i++) {
            let value = this.getElem(deltaVector[i].col, deltaVector[maxElemIndex].col);
            deltaVector[i].value += value;
        }
        // console.log('Delete elem: ', deltaVector[maxElemIndex]);
        deltaVector.splice(maxElemIndex, 1);
    }

    excludeGroup(group) {
        console.log('GROUP: ', group);
        for (let i = 0; i !== this.size * this.size; i++) {
            for (let j = 0; j !== group.length; j++) {
                if (group[j].col === this.data[i].col || group[j].col === this.data[i].row) {
                    this.data[i].inGroup = true;
                }
            }
        }
    }

    resetGroups() {
        this.data.forEach((elem) => {
            elem.inGroup = false;
        });
    }

    print() {
        const matrix = new Array(this.size);
        for (let i = 0; i !== this.size; i++) {
            matrix[i] = new Array(this.size);
        }
        this.data.forEach((elem) => {
            matrix[elem.row][elem.col] = (elem.inGroup) ? '_' : elem.value;
        });
        console.table(matrix);
    }
}

module.exports = Matrix;
