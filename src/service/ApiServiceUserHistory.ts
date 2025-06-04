import axios from "axios";
import { API } from "./ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Get the history of a user
 */
export const getUserHistory = async (userId: string) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Missing token!");

  try {
    const response = await axios.get(`${API}/api/user/${userId}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching user history:", err);
    throw err;
  }
};

/**
 * Add a meal to user history
 */
export const addUserHistory = async (
  userId: string,
  idmeal: number | string
) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Missing token!");

  try {
    const response = await axios.post(
      `${API}/api/user/${userId}/history`,
      { idMeal: idmeal },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err: any) {
    console.error("Error adding user history:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Delete a meal from user history
 */
export const deleteUserHistory = async (
  userId: string,
  idmeal: number | string
) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Missing token!");

  try {
    const response = await axios.delete(
      `${API}/api/user/${userId}/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { idmeal }, // ✅ still works as long as backend supports it
      } as any // type assertion to bypass TS error
    );
    return response.data;
  } catch (err) {
    console.error("Error deleting user history:", err);
    throw err;
  }
};
