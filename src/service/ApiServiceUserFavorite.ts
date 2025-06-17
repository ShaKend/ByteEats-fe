import axios from "axios";
import { API } from "./ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

type IsFavoriteResponse = {
  success: boolean;
  message: string;
  isExists: boolean;
};

export const getAllUserFavorite = async(userId: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Missing token!");
    }

    try{
        const response = await axios.get(`${API}/api/user/${userId}/favorites`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data
    }catch(err){
        console.error("Error: ", err);
        throw err;
    }
};

export const isFavorite = async (
  userId: string,
  idmeal: string
): Promise<IsFavoriteResponse> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Missing token!");

  // Add generic here:
  const response = await axios.get<IsFavoriteResponse>(`${API}/api/user/${userId}/isFavorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { idmeal },
  });

  return response.data; // now TypeScript knows it's IsFavoriteResponse
};

export const addUserFavorite = async(userId: string, idmeal: number | string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Missing token!");
    }

    try{
        const response = await axios.post(`${API}/api/user/${userId}/favorites`, {userId, idmeal}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }catch(err){
        console.error("Error: ", err);
        throw err;
    }
};

export const deleteUserFavorite = async (userId: string, idmeal: number | string) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    throw new Error("Missing token!");
  }

  try {
    const response = await axios.request({
        url: `${API}/api/user/${userId}/favorites`,
        method: 'DELETE',
        headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { idmeal }, 
    });
    return response.data
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};
