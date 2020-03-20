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
    for (let i = 0; i !== containers.length; i++) {
        let containerSize = containersVariant[i];
        let deltaVector = matrix.getDeltaVector(containerSize);
        matrix.excludeGroup(deltaVector);
        containers[i] = deltaVector;
        for (let elem in deltaVector) {
            containers[i][elem] = deltaVector[elem];
        }
    }
    let externalLinksCount = 0;
    containers.forEach((elem) => {
        Array.from(elem.values()).forEach((links) => {
            externalLinksCount += links;
        });
        // console.log('Vertexes: ', elem.size, elem.keys(), 'Links:', elem.values());
    });
    // console.log(containersVariant);
    // console.log('External links:', externalLinksCount);
    return {containers, externalLinksCount};
};

(async () => {
    // const containerVariants = Generator.getContainersVariants([3, 4, 5, 6, 7], 5, 10, 30);
    const containerVariants = Generator.calculatedContainersVariants;

    const parsedCSV = await readFile();
    const matrix = new Matrix(parsedCSV);

    let variants = new Array(containerVariants.length);
    containerVariants.forEach((elem, index) => {
        variants[index] = calculate(matrix, elem);
    });
    let optimalVariant = variants[0];
    variants.forEach((elem, index) => {
        if (optimalVariant.externalLinksCount > elem.externalLinksCount) {
            optimalVariant = elem;
            optimalVariant.containersVariant = containerVariants[index];
        }
    });
    console.log(optimalVariant);
})();