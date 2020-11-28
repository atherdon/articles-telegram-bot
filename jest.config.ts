/**
 * Jest config file
 * */
export default {
  clearMocks: true,
  coveragePathIgnorePatterns: ["node_modules", "src", "dist", "db"],
  coverageProvider: "v8",
  moduleFileExtensions: ["ts"],
  notify: true,
  notifyMode: "failure-change",
  runner: "jest-runner",
  testEnvironment: "node",
  timers: "real",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/", "/src/", "/dist/", "/db/"],
  verbose: false,
};
