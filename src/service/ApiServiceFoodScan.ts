import axios from "axios";
import { API } from "./ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const uploadFoodImage = async (formData: FormData) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found in AsyncStorage");
  }
  try {
    const response = await axios.post(`${API}/api/food/scan-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error uploading food:", err);
    throw err;
  }
};