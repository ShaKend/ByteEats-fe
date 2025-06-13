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
      { idmeal },
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
  idmeal: number | string | undefined
) => {
  if (!idmeal) {
    console.warn("🚨 idmeal is undefined!");
    return;
  }

  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Missing token!");

  try {
    const response = await axios.request({
      method: "DELETE",
      url: `${API}/api/user/${userId}/history`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { idmeal },
    });
    return response.data;
  } catch (err: any) {
    console.error(
      "Error deleting user history:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const deleteAllUserHistories = async (userId: string) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Missing token!");

  try {
    const response = await axios.delete(
      `${API}/api/user/${userId}/history/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err: any) {
    console.error(
      "Error deleting all user history:",
      err.response?.data || err.message
    );
    throw err;
  }
};




