import axios from "axios";
import { API } from "./ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserFavorite = async(userId: string) => {
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
    data: { userId, idmeal }, // ✅ works in all Axios versions
});
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};
