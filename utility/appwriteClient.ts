import { Account, Appwrite, Storage } from "@refinedev/appwrite";

const APPWRITE_URL = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const resources = {
  recipes: process.env.NEXT_PUBLIC_APPWRITE_RECIPES_COLLECTION_ID,
  users: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
} as const;
const appwriteClient = new Appwrite();

appwriteClient.setEndpoint(APPWRITE_URL).setProject(APPWRITE_PROJECT);
const account = new Account(appwriteClient);
const storage = new Storage(appwriteClient);

const getPrefs = async (id: string) => {
  try {
    const response = await account.getPrefs(id);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw error;
  }
};
const updatePrefs = async (prefs: Record<string, any>) => {
  try {
    const response = await account.updatePrefs(prefs);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw error;
  }
};
const updateName = async (name: string) => {
  try {
    const response = await account.updateName(name);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error updating name:", error);
    throw error;
  }
};
const updateEmail = async (email: string, password: string) => {
  try {
    const response = await account.updateEmail(email, password);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
};

export {
  appwriteClient,
  account,
  storage,
  resources,
  getPrefs,
  updatePrefs,
  updateName,
  updateEmail,
};
