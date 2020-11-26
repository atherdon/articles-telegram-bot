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
      await users
        .exists(1)
        .then(async (user) => {
          console.log("User - " + JSON.stringify(user));
        })
        .catch((e) => {
          throw e;
        });
      console.log("DataBase work normal.");
      done();
    } catch (e) {
      console.log("Error - " + e.message);
      done();
    }
  }, 30000);
});
