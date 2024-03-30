module.exports = {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testMatch": [
        "<rootDir>/src/**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "collectCoverageFrom": [
        "src/controllers/**/**.ts"
    ],
    "verbose": true
}
