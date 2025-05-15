import axios from "axios";
import { API } from "./ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${API}/api/user/${userId}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    throw err;
  }
};

export const login = async (email?: string, password?: string) => {
  try {
    const response = await axios.post(`${API}/api/login`, { email, password });
    return response.data;
  } catch (err) {
    console.error("Error during login:", err);
    throw err;
  }
};

export const createUser = async (
  email?: string,
  authprovider?: string,
  username?: string,
  password?: string,
  profilepicture?: string
) => {
  if (!profilepicture) profilepicture = "profile.png";

  try {
    const response = await axios.post(`${API}/api/user/createUser`, {
      email,
      authprovider,
      username,
      password,
      profilepicture,
    });
    return response.data;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

export const updateUser = async (
  userId: string,
  username?: string,
  password?: string,
  profilepicture?: string,
  gender?: string,
  age?: number
) => {
  try {
    const response = await axios.put(`${API}/api/user/updateUser/${userId}`, {
      username,
      password,
      profilepicture,
      gender,
      age
    });
    return response.data;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};

export const getProfile = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found in AsyncStorage");
  }
  try {
    const response = await axios.get(`${API}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching profile:", err);
    throw err;
  }
};
