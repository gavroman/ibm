const Generator = require('./generateContainers.js');
const Matrix = require('./matrix.js');
const neatCsv = require('neat-csv');
const util = require('util');
const fs = require('fs');

let readFile = (filename) => {
    const data = fs.readFileSync(filename, 'utf8');
    return neatCsv(data);
};

let groupInContainers = (matrix, containersVariant) => {
    const containers = new Array(containersVariant.length);
    matrix.resetGroups();
    for (let i = 0; i !== containers.length; i++) {
        let containerSize = containersVariant[i];
        containers[i] = matrix.getDeltaVector(containerSize);
    }
    let externalLinksCount = 0;
    containers.forEach((elem) => {
        Array.from(elem.values()).forEach((links) => {
            externalLinksCount += links;
        });
    });
    return {containers, externalLinksCount};
};

let printVariants = (variants) => {
    variants.forEach((variant) => {
        console.log(variant.containers, 'External:', variant.externalLinksCount);
    })
};

(async () => {
    // const containerVariants = Generator.getContainersVariants([3, 4, 5, 6, 7], 5, 10, 30);
    const containersVariants = Generator.calculatedContainersVariants;

    const parsedCSV = await readFile('data/variants.csv');
    const matrix = new Matrix(parsedCSV);

    let groupVariants = new Array(containersVariants.length);
    containersVariants.forEach((elem, index) => {
        groupVariants[index] = groupInContainers(matrix, elem);
    });

    let optimalVariant = groupVariants[0];
    groupVariants.forEach((elem, index) => {
        if (optimalVariant.externalLinksCount > elem.externalLinksCount) {
            optimalVariant = elem;
            optimalVariant.containersVariant = containersVariants[index];
        }
    });
    // printVariants(groupVariants);
    console.log('\nOPTIMAL VARIANT:\n', optimalVariant);
})();