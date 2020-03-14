const {modulePathIgnorePatterns, testMatch} = require('@njmaeff/private-config/jest.common');
module.exports = {
    testMatch,
    modulePathIgnorePatterns,
    moduleNameMapper: {
        "@njmaeff/coq-(.*)": "<rootDir>/src/coq-$1",
        "@njmaeff/private-(.*)": "<rootDir>/util/$1",
    }
}
