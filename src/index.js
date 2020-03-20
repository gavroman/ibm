const Generator = require('./generateContainers.js');
const Matrix = require('./matrix.js');
const neatCsv = require('neat-csv');
const util = require('util');
const fs = require('fs');

let readFile = () => {
    const data = fs.readFileSync('data/variants.csv', 'utf8');
    // let data = fs.readFileSync('data/test.csv', 'utf8');
    return neatCsv(data);
};


let calculate = (matrix, containersVariant) => {
    const containers = new Array(containersVariant.length);
    matrix.resetGroups();
    // for (let i = 0; i !== containers.length; i++) {
        const containerSize = containersVariant[0];
        const deltaVector = matrix.getDeltaVector();

        while (deltaVector.length !== containerSize) {
            console.log(deltaVector);
            matrix.reduceDeltaVector(deltaVector);
        }
        console.log(deltaVector);
        matrix.excludeGroup(deltaVector);
        // matrix.print();
       // containers[i] = deltaVector;
    // }
    // console.log(containersVariant);
    // console.log(containers);

    // matrix.print();
};

(async () => {
    // const containerVariants = Generator.getContainersVariants([3, 4, 5, 6, 7], 5, 10, 30);
    const containerVariants = Generator.calculatedContainersVariants;
    // console.log(containerVariants);

    const parsedCSV = await readFile();
    const matrix = new Matrix(parsedCSV);

    calculate(matrix, containerVariants[0]);
})();