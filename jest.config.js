const { pathsToModuleNameMapper } = require("ts-jest/utils")
const path = require("path")

const { compilerOptions } = require("./tsconfig.json")

module.exports = {
	roots: ["<rootDir>/lib"],
	collectCoverageFrom: ["<rootDir>/lib/**/*.ts"],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `${path.resolve(__dirname, ".")}/` }),
	coverageDirectory: "coverage",
	testEnvironment: "node",
	transform: {
		".+\\.ts$": "ts-jest",
	},
}
