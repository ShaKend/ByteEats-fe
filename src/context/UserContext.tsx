import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "../service/ApiServiceUser";

export type User = {
  userid: string;
  username: string;
  email: string;
  gender?: string;
  age?: string;
  profilepicture?: string;
  password?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  refreshUser: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user profile on mount if token exists
  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = (await getProfile()) as { data: User };
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);