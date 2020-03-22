const RMatrix = require('./rMatrix.js');

class Solver {
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

    printMatrix() {
        const matrix = new Array(this.size);
        for (let i = 0; i !== this.size; i++) {
            matrix[i] = new Array(this.size);
        }
        this.data.forEach((elem) => {
            matrix[elem.row][elem.col] = (elem.inGroup) ? '▒' : elem.value;
        });
        console.table(matrix);
    }

//------------------------------ Task 1.1 ----------------------------------
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

    excludeInternalDependencies(group) {
        for (let [keyI, valueI] of group) {
            let internalDepSum = 0;
            for (let [keyJ, valueJ] of group) {
                let value = this.getElem(keyI, keyJ);
                internalDepSum += value;
            }
            group.set(keyI, valueI - internalDepSum);
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

//------------------------------ Task 1.2 ----------------------------------
    optimizeSolution(groups) {
        for (let i = 0; i !== groups.length - 1 ; i++) {
            let currentGroup = groups[i];
            let bestVariant = {};
            bestVariant.maxElement = {value: 1};
            while (bestVariant.maxElement.value > 0) {
                let rMatrices = [];
                for (let j = i + 1; j !== groups.length; j++) {
                    let candidateGroup = groups[j];
                    let rMatrix = new RMatrix(currentGroup, candidateGroup);
                    rMatrix.fill(this);
                    let maxElement = rMatrix.findMax();
                    rMatrices.push({
                        matrix: rMatrix,
                        group: candidateGroup,
                        maxElement: maxElement
                    });
                }
                bestVariant = rMatrices[0];
                // finding max delta in all matrices
                rMatrices.forEach((elem) => {
                    if (elem.maxElement.value > bestVariant.maxElement.value) {
                        bestVariant = elem;
                    }
                    elem.matrix.print();
                });
                console.log('=================='.repeat(2),'BEST VARIANT','===================='.repeat(2));
                bestVariant.matrix.print();
                console.log(bestVariant.maxElement);
                console.log('================================================='.repeat(2));
                if (bestVariant.maxElement.value > 0) {
                    this.swapElementsInGroups(currentGroup, bestVariant.group, {
                        left: bestVariant.maxElement.row,
                        right: bestVariant.maxElement.col,
                    });
                }
                console.log('\nAFTER SWAP:');
                groups.forEach((group) => {
                    console.log(JSON.stringify(group));
                });
                console.log('\n');
            }
        }
    }

    swapElementsInGroups(leftGroup, rightGroup, elements) {
        const leftIndex = leftGroup.indexOf(elements.left);
        const rightIndex = rightGroup.indexOf(elements.right);
        leftGroup[leftIndex] = elements.right;
        rightGroup[rightIndex] = elements.left;
    }

    calculateExternalDependencies(groups) {
        let containers = [];
        let sumVector = this.getRowsSums();
        groups.forEach((group) => {
            let container = new Map();
            group.forEach((vertex) => {
                let vertexDependencies = sumVector.get(vertex);
                container.set(vertex, vertexDependencies);
            });
            this.excludeInternalDependencies(container);
            containers.push(container);
        });
        return containers;
    }
//------------------------------ End Task 1.2 ------------------------------
}

module.exports = Solver;
