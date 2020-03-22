const Generator = require('./generateContainers.js');
const Solver = require('./solver.js');
const neatCsv = require('neat-csv');
const util = require('util');
const fs = require('fs');

let readFile = (filename) => {
    const data = fs.readFileSync(filename, 'utf8');
    return neatCsv(data);
};

//------------------------------ Task 1.1 ----------------------------------
let groupInContainers = (grouper, containersVariant) => {
    const containers = new Array(containersVariant.length);
    grouper.resetGroups();
    for (let i = 0; i !== containers.length; i++) {
        let containerSize = containersVariant[i];
        containers[i] = grouper.getDeltaVector(containerSize);
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

let findOptimalVariant = (variants) => {
    let optimalVariant = variants[0];
    variants.forEach((elem, index) => {
        if (optimalVariant.externalLinksCount > elem.externalLinksCount) {
            optimalVariant = elem;
        }
    });
    return optimalVariant;
};

let getAllGroupVariants = (grouper) => {
    // const containersVariants = Generator.getContainersVariants([3, 4, 5, 6, 7], 5, 10, 30);
    // const containersVariants = Generator.getContainersVariants([2, 3], 3, 3, 8);
    const containersVariants = Generator.calculatedContainersVariants;
    let groupVariants = new Array(containersVariants.length);
    containersVariants.forEach((elem, index) => {
        groupVariants[index] = groupInContainers(grouper, elem);
    });
    grouper.resetGroups();
    return groupVariants;
};
//------------------------------ End Task 1.1 ------------------------------

//------------------------------ Task 1.2 ----------------------------------

let optimize = (grouper, solution) => {
    let groups = [];
    for (let group of solution) {
        groups.push(Array.from(group.keys()));
    }
    grouper.optimizeSolution(groups);
    let containers = grouper.calculateExternalDependencies(groups);
    let externalLinksCount = 0;
    containers.forEach((elem) => {
        Array.from(elem.values()).forEach((links) => {
            externalLinksCount += links;
        });
    });
    externalLinksCount /= 2;  // /2 потому что каждая связь учитывается для обоих связанных групп
    return {containers, externalLinksCount};
};

//------------------------------ End Task 1.2 ------------------------------


(async () => {
    const parsedCSV = await readFile('data/variants.csv');
    // const parsedCSV = await readFile('data/test.csv');
    // const parsedCSV = await readFile('data/testsem.csv');
    const grouper = new Solver(parsedCSV);

    let variants = getAllGroupVariants(grouper);
    let optimal = findOptimalVariant(variants);
    // printVariants(variants); // all variants
    console.log('\nOPTIMAL VARIANT:\n', optimal);

    let optimized = optimize(grouper, optimal.containers);
    console.log('▒'.repeat(100), '\nOLD VARIANT:\n', optimal, '\n', '▒'.repeat(100));
    console.log('\nNEW VARIANT:\n', optimized, '\n','▒'.repeat(100));
})();


