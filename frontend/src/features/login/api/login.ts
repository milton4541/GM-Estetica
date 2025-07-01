import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/login";

export const login = async (nombre_usuario: string, password: string) => {
    const response = await axios.post(API_URL, { nombre_usuario, password });
    console.log("Login response:", response.data);
    return response.data;
};