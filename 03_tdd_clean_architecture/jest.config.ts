/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",

    testEnvironment: "node",

    // A map from regular expressions to paths to transformers
    transform: {
        "^.+\\.(t|j)sx?$": ["@swc/jest"],
    },

    root: ["<rootDir>/src"],
    moduleNameMapper: {
        "@/(.*)": "<rootDir>/src/$1",
    },
};
