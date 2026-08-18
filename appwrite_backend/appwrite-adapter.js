//the appwrite file already has the account creation method being exported 
import {account, databases} from "./lib/appwrite"
import {ID, Query} from "appwrite";

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

const getProfile = async() =>{
    try{
        const user = await account.get()

        const profile = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_PROFILE_TABLE,
            /*To preserve the auto id of the document in the profile table 
            we get the info according to the user's id stored in userId */
            [
                Query.equal('userId', user.$id)
            ]
        );
        return profile;
    }
    catch(error){
        throw new Error(error.message)
    }
}

const getAllFiles = async() =>{
    const user = await account.get()

    const fileInfo = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_FILES_TABLE,
      /*getDocument will not work as it would need the document's ID
      and each document needs to have a unique id which will not work as a single user can have multiple 
      files(documents)*/
      [
        Query.equal('ownerId', user.$id)
      ]
    );
    if(fileInfo.length === 0){
        throw new Error("No files available in database")
    }
    return fileInfo
}

const getFileByIdAppwrite = async(fileId) =>{
    const user = await account.get() //to ensure user is logged in

    //getDocument is used as the search is by file id and not user id so each document will have only one id
    const fileInfoId = await databases.getDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_FILES_TABLE,
      fileId
    );
    console.log(fileInfoId)
    console.log(fileInfoId.ownerId)
    if(fileInfoId.ownerId !== user.$id){
        console.log("no access")
        throw new Error("403: Unauthorized access")
    }

    if(fileInfoId.length === 0){
        console.log("not found")
        throw new Error("404: File not found")
    }
    
    return fileInfoId
}


export {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  getAllFiles,
  getFileByIdAppwrite,
};