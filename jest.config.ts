import { join } from "path";

export default {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: 'jsdom',
  modulePaths: [join(__dirname, "node_modules")],
  testMatch: ["**/__tests__/**/*.[jt]s(x)?"],
};