module.exports = {
    testEnvironment: 'node',
    transform: { "^.+\\.js$": "babel-jest" },
    setupFilesAfterEnv: ['./jest.setup.js'],
    verbose: false,
    testPathIgnorePatterns: [
        "source/*",
        ".dev/*",
        "build/*",
    ],
    modulePaths: [
        "<rootDir>/packages/"
    ],
    collectCoverage: true,
    transformIgnorePatterns: [
        "node_modules"
    ],
    modulePathIgnorePatterns: [
        "source/.*",
        "script/.*",
        ".dev/.*",
        "build/.*",
    ]
};
