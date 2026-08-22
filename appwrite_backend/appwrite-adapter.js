// import {ID, Query} from "appwrite";
const { ID, Query } = window.Appwrite;


//registration code
const registerUser = async(appwriteMethods, email, password)=>{
    const user = await appwriteMethods.account.create(
        ID.unique(),
        email,
        password
    );
    return {email: user.email}; //returning it as later the user's ID is needed to make their profile 
}

const loginUser = async(appwriteMethods, email, password) =>{
    const session = await appwriteMethods.account.createEmailPasswordSession(email, password)

    return session;
}
const logoutUser = async (appwriteMethods) => {
  const resultLogout = await appwriteMethods.account.deleteSession("current");

  return resultLogout;
};

const getProfile = async(appwriteMethods, database_id) =>{
    try{
        const user = await appwriteMethods.account.get()
        return {email: user.email};
    }
    catch(error){
        throw new Error(error.message)
    }
}

const getAllFiles = async(appwriteMethods, database_id, files_table_id) =>{
    const user = await appwriteMethods.account.get()

    const fileInfo = await appwriteMethods.databases.listDocuments(
      database_id,
      files_table_id,
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
const getFileByIdAppwrite = async(appwriteMethods, database_id, files_table_id, fileId) =>{
  const user = await appwriteMethods.account.get(); //to ensure user is logged in
  try {
    //getDocument is used as the search is by file id and not user id so each document will have only one id
    const fileInfoId = await appwriteMethods.databases.getDocument(
      database_id,
      files_table_id,
      fileId,
    );
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

const downloadFile = async (appwriteMethods, database_id, files_table_id, fileId, bucketId) => {

  try {
    const user = await appwriteMethods.account.get();

    //check if the file exists if it does there will be no error 
    const file = await appwriteMethods.databases.getDocument(
      database_id,
      files_table_id,
      fileId,
    );

    const downloadURL = appwriteMethods.storage.getFileDownload(
      bucketId,
      fileId
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