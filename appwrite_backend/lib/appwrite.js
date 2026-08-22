// import { Client, Account, Databases, Storage} from "appwrite";
const { Client, Account, Databases, Storage} = window.Appwrite
// console.log(document.getElementById("awProjectId").value)
// const client = new Client()
//   .setEndpoint(document.getElementById("awEndpoint").value)
//   .setProject(document.getElementById("awProjectId").value);

// const account = new Account(client);
// const databases = new Databases(client);
// const storage = new Storage(client);

// export { client, account, databases, storage };

//initially null as these values will be filled later

//as the values need to be read from the GUI this function will set the config when the backend mode
//is changed and not when the DOM is loaded
let appwriteMethods = null
const configure = (endpoint, projectId) =>{
  console.log(endpoint)
  const client = new Client().setEndpoint(endpoint)
    .setProject(projectId)

  appwriteMethods = {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client)
  }
  return appwriteMethods
}

export {configure}
