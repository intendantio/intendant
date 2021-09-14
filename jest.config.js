module.exports = {
    testEnvironment: 'node',
    transform: { "^.+\\.js$": "babel-jest" },
    setupFilesAfterEnv: ['./jest.setup.js'],
    verbose: false,
    modulePaths: [
        "<rootDir>/sources/"
    ],
    moduleDirectories: [
        "node_modules",
    ],
    collectCoverage: false,
    modulePathIgnorePatterns: [
        "sources/.*",
        "dev/.*",
        "template/.*"
    ]
};
