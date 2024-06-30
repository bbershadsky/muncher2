import { AuthProvider } from "@refinedev/core";
import { account } from "./utility";
import { AppwriteException, ID } from "@refinedev/appwrite";
import {
  CheckResponse,
  OnErrorResponse,
} from "node_modules/@refinedev/core/dist/contexts/auth/types";

type AuthActionResponse = {
  success: boolean;
  redirectTo?: string;
  error?: {
    message: string;
    name: string;
  };
};

export const authProvider: AuthProvider = {
  login: async ({ email, password }): Promise<AuthActionResponse> => {
    try {
      await account.createEmailSession(email, password);
      return {
        success: true,
        redirectTo: "/users/new",
      };
    } catch (e) {
      const { type, message, code } = e as AppwriteException;
      return {
        success: false,
        error: {
          message,
          name: `${code} - ${type}`,
        },
      };
    }
  },
  register: async ({ email, password }): Promise<AuthActionResponse> => {
    try {
      await account.create(ID.unique(), email, password);
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (e) {
      const { type, message, code } = e as AppwriteException;
      return {
        success: false,
        error: {
          message,
          name: `${code} - ${type}`,
        },
      };
    }
  },
  logout: async (): Promise<AuthActionResponse> => {
    try {
      await account.deleteSession("current");
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message,
          name: "LogoutError",
        },
      };
    }
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const user = await account.get();
    if (user) {
      return user;
    }
    return null;
  },
  check: function (params?: any): Promise<CheckResponse> {
    throw new Error("Function not implemented.");
  },
  onError: function (error: any): Promise<OnErrorResponse> {
    throw new Error("Function not implemented.");
  },
};
