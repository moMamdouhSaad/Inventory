import { UserCredentials } from "../Shared/Model";
import * as NeDB from 'nedb'

export class UserCredentialsDBAccess{
    
    private nedb:NeDB;

    constructor(){

        this.nedb = new NeDB('database/UserCredentials.db');
        this.nedb.loadDatabase();

    }   

    public async putUserCredentials(userCredentials:UserCredentials) :Promise<any>{
    

        return new Promise((resolve,reject)=>{

                this.nedb.insert(userCredentials,(err:Error | null,docs:any)=>{

                    if(err){
                        reject(err.message)
                    }else{
                        console.log(docs)
                        resolve(docs)
                    }

                });


        })

    }

    public async getUserCredentials(username:string,password:string):Promise<UserCredentials | undefined>{
 
        
            return new Promise((resolve,reject)=>{
                this.nedb.find({username:username,password:password},
                    (error:Error|null, docs:UserCredentials[])=>{

                    if(error){
                        reject(error.message)
                    }else{
                        if(docs.length == 0){
                            resolve(undefined)
                        }else{
                            resolve(docs[0])
                        }
                    }

                })
            })

        
    }

}