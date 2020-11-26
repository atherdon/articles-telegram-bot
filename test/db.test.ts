import { Users } from "../src/users/users";
import * as path from "path";

describe("Testing DB", () => {
  test("DB connection", async (done) => {
    try {
      console.log("Connecting to SQLite3.");
      const users = new Users(
        path.join(__dirname, "..", "db", "users.sqlite3")
      );
      console.log("Connection was successfully!");
      console.log("Checking users DataBase");
      users
        .getUsers()
        .then((usrs) => {
          console.log("Users - " + JSON.stringify(usrs));
          console.log("DataBase work normal.");
          done();
        })
        .catch((e) => {
          throw e;
        });
    } catch (e) {
      console.log("Error - " + e.message);
      done();
    }
  }, 30000);
});
