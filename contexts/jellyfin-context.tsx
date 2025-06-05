"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Jellyfin, Api } from "@jellyfin/sdk";
import type { UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api";
import { useRouter, usePathname } from "next/navigation";

interface FormData {
  serverUrl: string;
  username: string;
  password: string;
}

interface JellyfinContextType {
  login: () => Promise<void>;
  logout: () => void;
  formData: FormData;
  setFormData: (formData: FormData) => void;
  api: Api | null;
  user: UserDto | null;
}

const JellyfinContext = createContext<JellyfinContextType | undefined>(undefined);

export function JellyfinProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({
    serverUrl: "",
    username: "",
    password: "",
  });

  const [api, setApi] = useState<Api | null>(null);
  const [user, setUser] = useState<UserDto | null>(null)
  const [jellyfin, setJellyfin] = useState<Jellyfin | null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      setJellyfin(() => (
        new Jellyfin({
          clientInfo: { name: "Pico", version: "0.1.0" },
          deviceInfo: { name: "Web Client", id: "pico-client-web" },
        })
      ))
    })();
  }, [])


  const login = async () => {
    if (!jellyfin) throw new Error("Jellyfin not initialized")

    const _api = jellyfin.createApi(`https://${formData.serverUrl}`)
    setApi(_api)

    try {
      const auth = await _api.authenticateUserByName(formData.username, formData.password)

      const { AccessToken, User } = auth.data

      if (AccessToken && User) {
        setUser(User);
        localStorage.setItem("serverUrl", formData.serverUrl)
        localStorage.setItem("user", JSON.stringify(User))
        setApi(jellyfin.createApi(_api.basePath, AccessToken))
        localStorage.setItem("token", AccessToken)
      }
    } catch (error: any) {
      throw new Error(error)
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setApi(null);
    setUser(null)
  };


  useEffect(() => {
    if (initialLoaded) {
      setLoaded(true);
    }
  }, [initialLoaded]);

  useEffect(() => {
    const initJellyfin = async () => {
      if (!jellyfin) return;

      try {
        const token = localStorage.getItem("token")
        const serverUrl = localStorage.getItem("serverUrl")
        const storedUser = getUserFromStorage()

        if (token && serverUrl) {
          const _api = jellyfin.createApi(`https://${serverUrl}`, token)
          setApi(_api)

          if (storedUser?.Id) {
            setUser(storedUser)
          }

          const res = await getUserApi(_api).getCurrentUser();
          setUser(res.data)
        }
      } catch (error: any) {
        console.error(error)
      } finally {
        setInitialLoaded(true)
      }
    };
    initJellyfin()
  }, [jellyfin])

  useProtectedRoute(user, loaded)

  return (
    <JellyfinContext.Provider
      value={{
        login,
        logout,
        formData,
        setFormData,
        api,
        user,
      }}
    >
      {children}
    </JellyfinContext.Provider>
  );
}

export function useJellyfin() {
  const context = useContext(JellyfinContext);
  if (!context) {
    throw new Error("useJellyfin must be used within a JellyfinProvider");
  }
  return context;
}

export function useProtectedRoute(user: UserDto | null, loaded = false) {
  const pathname = usePathname()
  const router = useRouter();

  useEffect(() => {
    if (!loaded) return;

    const isAuthPage = pathname.startsWith("/login")

    if (!user?.Id && !isAuthPage) {
      console.log("Redirecting to login");
      router.replace("login");
    } else if (user?.Id && isAuthPage) {
      console.log("Redirecting to home");
      router.replace("/");
    }
  }, [user, pathname, loaded, router]);
}

function getUserFromStorage(): UserDto | null {
  const userStorage = localStorage.getItem("user")
  if (userStorage) {
    try {
      return JSON.parse(userStorage) as UserDto
    } catch (error: any) {
      console.error(error)
    }
  }
  return null;
}
