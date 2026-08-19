import { Client, Account, Databases, Storage} from "appwrite";
console.log(document.getElementById("awProjectId").value)
const client = new Client()
  .setEndpoint(document.getElementById("awEndpoint").value)
  .setProject(document.getElementById("awProjectId").value);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };
