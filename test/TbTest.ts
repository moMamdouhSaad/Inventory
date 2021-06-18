import { UserCredentialsDBAccess } from "../src/Authorization/UserCredentialsDBAccess";
import { WorkingPosition } from "../src/Shared/Model";
import { UserDBAccess } from "../src/User/UserDBAccress";

class DbTest {
  public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
  public userDbAccess: UserDBAccess = new UserDBAccess();

  constructor() {}
}
console.log("?");

new DbTest().dbAccess.putUserCredentials({
  username: "first_user",
  password: "password",
  accessRights: [0, 1, 2, 3],
});
// new DbTest().userDbAccess.putUser({
//   age: 10,
//   email: "testEmail",
//   name: "mamdouh",
//   workingPosition: WorkingPosition.JUNIOR,
//   id: "55",
// });
