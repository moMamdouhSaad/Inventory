import Nedb = require("nedb");
import { User } from "../Shared/Model";
import dbConnection from "../db/connection";

export class UserDBAccess {
  private nedb: Nedb;

  constructor() {
    this.nedb = new Nedb("database/User.db");
    this.nedb.loadDatabase();
  }

  public async putUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      this.nedb.insert(user, (err: Error | null, data) => {
        if (err) {
          reject(err.message);
        } else {
          resolve();
        }
      });
    });
  }

  public async getUserById(id: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find({ id: id }, (err: Error, data: User[]) => {
        if (err) {
          reject(err.message);
        } else {
          if (data.length == 0) {
            resolve(undefined);
          } else {
            resolve(data[0]);
          }
        }
      });
    });
  }

  public async getUserByName(name: string): Promise<User[]> {
    const regEx = new RegExp(name);
    return new Promise((resolve, reject) => {
      this.nedb.find({ name: regEx }, (err: Error, data: User[]) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(data);
        }
      });
    });
  }

  public async deleteUserById(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.nedb.remove({ id: id }, (err: Error | null, numRemoved: number) => {
        if (err) {
          reject(err.message);
        } else {
          if (numRemoved == 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      });
    });
  }
}
