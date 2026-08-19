//the appwrite file already has the account creation method being exported 
import {account, databases, storage} from "./lib/appwrite"
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
            document.getElementById("awDatabaseId").value,
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
      document.getElementById("awDatabaseId").value,
      document.getElementById("awFilesCollectionId").value
      /*getDocument will not work as it would need the document's ID
      and each document needs to have a unique id which will not work as a single user can have multiple 
      files(documents)*/
      [Query.equal("ownerId", user.$id)],
    );
    if(fileInfo.length === 0){
        throw new Error("No files available in database")
    }
    return fileInfo
}

/*As appwrite's row security is enabled it throws the file not found error if an unauthorized user is trying 
to access the file 

To implement two distinguished errors of file not found and unauthorized access appwrite's row security will need
to be disabled and permissions need to be "Any users"->Read

As this is not the best approach it is not taken into execution the code for the two distinguished errors
is commented below*/
const getFileByIdAppwrite = async(fileId) =>{
  const user = await account.get(); //to ensure user is logged in
  try {
    //getDocument is used as the search is by file id and not user id so each document will have only one id
    const fileInfoId = await databases.getDocument(
      document.getElementById("awDatabaseId").value,
      document.getElementById("awFilesCollectionId").value,
      fileId,
    );
    console.log(fileInfoId)
    return fileInfoId;
  } catch (error) {
    return {
      status: error.code,
      message: error.message,
    };
  }

  //the distinguished errors code:
  /*
        const fileInfoId = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_FILES_TABLE,
        fileId,
      );

      const retrievedFile = fileInfoId
        appwrite already handles errors for files that do not exist
        if(retrievedFile.ownerId !== user.$id){
            return{
                status: 403,
                message: "Unauthorized access"
            }
        }
        return fileInfoId
    */
}

const downloadFile = async (fileId) => {

  try {
    const user = await account.get();

    //check if the file exists if it does there will be no error 
    const file = await databases.getDocument(
      document.getElementById("awDatabaseId").value,
      document.getElementById("awFilesCollectionId").value,
      fileId,
    );

    const downloadURL = storage.getFileDownload(
      document.getElementById("awBucketId").value,
      fileId,
    );

    return downloadURL;
  } catch (error) {

    return {
      status: error.code,
      message: error.message,
    };
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  getAllFiles,
  getFileByIdAppwrite,
  downloadFile
};