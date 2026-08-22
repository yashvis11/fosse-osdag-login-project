let appwriteMethods = null
const configure = (endpoint, projectId) =>{

  const {Client, Account, Databases, Storage} = window.Appwrite

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
