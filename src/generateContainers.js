let PermutationsWithRepetition = (src, len) => {
    let K = len - 1, k = 0,
        N = src.length, n = 0,
        out = [],
        stack = [];

    function next() {
        while (true) {
            while (n < src.length) {
                out[k] = src[n++];
                if (k === K) {
                    return out.slice(0);
                } else {
                    if (n < src.length) {
                        stack.push(k);
                        stack.push(n);
                    }
                    k++;
                    n = 0;
                }
            }
            if (stack.length === 0) {
                break;
            }
            n = stack.pop();
            k = stack.pop();
        }
        return false;
    }

    function rewind() {
        k = 0;
        n = 0;
        out = [];
        stack = [];
    }

    function each(visitor) {
        rewind();
        let v;
        while (v = next()) {
            if (visitor(v) === false) {
                return;
            }
        }
    }

    return {
        next: next,
        each: each,
        rewind: rewind
    };
};

let arraysEquals = (left, right) => {
    if (left.length !== right.length) {
        return false;
    }
    for (let i = 0; i !== left.length; i++) {
        if (left[i] !== right[i]) {
            return false;
        }
    }
    return true;
};

module.exports = {
    calculatedContainersVariants: require('../data/containers.json').variants,
    getContainersVariants: (availableSizes, minCount, maxCount, matrixSize) => {
        let resultArray = [];

        for (let i = minCount; i !== maxCount + 1; i++) {
            let perms = PermutationsWithRepetition(availableSizes, i);
            perms.each((permutation) => {
                let sum = 0;
                for (let j = 0; j !== permutation.length; j++) {
                    sum += permutation[j];
                }
                if (sum === matrixSize) {
                    permutation = permutation.sort();
                    let j = 0;
                    for (j = 0; j !== resultArray.length; j++) {
                        if (arraysEquals(resultArray[j], permutation)) {
                            break;
                        }
                    }
                    if (j === resultArray.length) {
                        resultArray.push(permutation.sort());
                    }
                }
            });
        }
        return resultArray;
    },
};

