class RMatrix {
    constructor(vectorLeft, vectorTop) {
        this.rows = vectorLeft.length || 0;
        this.cols = vectorTop.length || 0;

        this.leftVector = vectorLeft;
        this.topVector = vectorTop;

        this.data = new Array(this.rows);
        for (let i = 0; i !== this.rows; i++) {
            this.data[i] = new Array(this.cols).fill(0);
        }
    }

    fill(matrix) {
        this.iterate((row, col) => {
            const leftVertex = this.leftVector[row];
            const topVertex = this.topVector[col];
            let ASum = 0;
            let BSum = 0;
            let CSum = 0;
            let DSum = 0;
            this.topVector.forEach((elem) => { // elem - index in GRAPH matrix
                ASum += matrix.getElem(leftVertex, elem);
                DSum += matrix.getElem(topVertex, elem);
            });
            this.leftVector.forEach((elem) => {
                BSum += matrix.getElem(leftVertex, elem);
                CSum += matrix.getElem(topVertex, elem);
            });
            this.data[row][col] = ((ASum - BSum) + (CSum - DSum)) - 2 * matrix.getElem(leftVertex, topVertex);
        });
    }

    findMax() {
        let maxValue = 0;
        let row = -1;
        let col = -1;
        this.iterate((i, j) => {
            if (this.data[i][j] > maxValue) {
                maxValue = this.data[i][j];
                col = this.topVector[j];
                row = this.leftVector[i];
            }
        });
        return {row, col, value: maxValue};
    }

    iterate(visitor) {
        for (let i = 0; i !== this.rows; i++) {
            for (let j = 0; j !== this.cols; j++) {
                visitor(i, j);
            }
        }
    }

    print() {
        console.log('LEFT', JSON.stringify(this.leftVector));
        console.log('TOP', JSON.stringify(this.topVector));
        console.table(this.data);
    }
}

module.exports = RMatrix;