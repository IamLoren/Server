/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {  
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
};