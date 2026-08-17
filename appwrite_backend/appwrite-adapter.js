//the appwrite file already has the account creation method being exported 
import {account, databases} from "./lib/appwrite"
import {ID} from "appwrite";

//registration code
const registerUser = async(email, password)=>{
    const user = await account.create(
        ID.unique(),
        email,
        password
    );
    return user; //returning it as later the user's ID is needed to make their profile 
}

const loginUser = async(email, password) =>{
    const session = await account.createEmailPasswordSession(email, password)

    return session;
}
const logoutUser = async () => {
  const resultLogout = await account.deleteSession("current");

  return resultLogout;
};


export {registerUser, loginUser, logoutUser}