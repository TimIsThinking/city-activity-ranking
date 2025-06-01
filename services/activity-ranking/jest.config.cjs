const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports= {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  transformIgnorePatterns: ['node_modules', '../node_modules'],
  testMatch: ['**/*.test.js'],
  setupFiles: [
    "<rootDir>/jest.setup.js"
  ]
};