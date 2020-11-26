import { Users } from "../src/users/users";
import * as path from "path";

describe("Testing DB", () => {
  test("Creating user", async (done) => {
    try {
      console.log("Connecting to SQLite3.");
      const users = new Users(
        path.join(__dirname, "..", "db", "users.sqlite3")
      );
      console.log("Connection was successfully!");
      console.log("Creating user DataBase");
      await users.create({
        uid: Math.floor(Math.random() * 1e7),
        filters: [""],
      });
      console.log("user created successfull");
      done();
    } catch (e) {
      console.log("Error - " + e.message);
      done();
    }
  }, 30000);
});
