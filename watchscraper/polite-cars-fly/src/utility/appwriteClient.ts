import { Account, Appwrite, Storage } from "@refinedev/appwrite";

const APPWRITE_URL = "https://gersu.com/v1";
const APPWRITE_PROJECT = "6738deb9001972df55a6";

const appwriteClient = new Appwrite();

appwriteClient.setEndpoint(APPWRITE_URL).setProject(APPWRITE_PROJECT);
const account = new Account(appwriteClient);
const storage = new Storage(appwriteClient);

export { appwriteClient, account, storage };
