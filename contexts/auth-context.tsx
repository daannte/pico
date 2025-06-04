"use client";

import { jellyfinClient } from "@/lib/jellyfin";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FormData {
  serverUrl: string;
  username: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  formData: FormData;
  setFormData: (formData: FormData) => void;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);
  const [formData, setFormDataState] = useState<FormData>({
    serverUrl: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    setIsAuthenticated(jellyfinClient.isAuthenticated())
  }, []);

  // useEffect(() => {
  //   const storedAuth = localStorage.getItem("isAuthenticated");
  //   const storedFormData = localStorage.getItem("formData");
  //
  //   if (storedAuth === "true") {
  //     setIsAuthenticatedState(true);
  //   }
  //
  //   if (storedFormData) {
  //     try {
  //       setFormDataState(JSON.parse(storedFormData));
  //     } catch (error) {
  //       console.error("Error parsing stored form data:", error);
  //     }
  //   }
  // }, []);
  //
  // useEffect(() => {
  //   localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  // }, [isAuthenticated]);
  //
  // useEffect(() => {
  //   localStorage.setItem("formData", JSON.stringify(formData));
  // }, [formData]);

  const setIsAuthenticated = (newIsAuthenticated: boolean) => {
    setIsAuthenticatedState(newIsAuthenticated);
  };

  const setFormData = (newFormData: FormData) => {
    setFormDataState(newFormData);
  };

  const login = () => {
    setIsAuthenticatedState(true);
  };

  const logout = () => {
    setIsAuthenticatedState(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        formData,
        setFormData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
