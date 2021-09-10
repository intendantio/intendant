module.exports = {
    testEnvironment: 'node',
    transform: { "^.+\\.js$": "babel-jest" },
    setupFilesAfterEnv: ['./jest.setup.js'],
    verbose: false,
    testPathIgnorePatterns: [
        "sources/*",
        ".dev/*",
        "scripts/*",
    ],
    modulePaths: [
        "<rootDir>/build/"
    ],
    collectCoverage: true,
    transformIgnorePatterns: [
        "node_modules",
        "node_modules/(?!(jest-)?crypto-js)",
        "moment",
    ],
    modulePathIgnorePatterns: [
        "sources/.*",
        "scripts/.*",
        ".dev/.*",
    ]
};
