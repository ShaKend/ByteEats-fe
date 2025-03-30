import axios from 'axios';
import { API } from './ApiService';

export const getUserById = async(userId: string) => {
    const response = await axios.get(`${API}/user/${userId}`);
    return response;
}

export const login = async(email?: string, password?: string) => {
    const response = await axios.post(`${API}/login`, {email, password});
    return response;
}

export const createUser = async(email?: string, authprovider?: string, username?: string, password?: string, profilepicture?: string) => {
    if(!profilepicture) profilepicture = './src/assets/favicon.png';

    const response = await axios.post(`${API}/user/createUser`, {email, authprovider, username, password, profilepicture});
    return response;
}

export const updateUser = async(userId: string, username?: string, password?: string, profilepicture?: string) => {
    const response = await axios.put(`${API}/user/updateUser/${userId}`, {username, password, profilepicture});
    return response;
}

