import api from "../../../utils/axios";

const API_URL = "/login";

export const login = async (nombre_usuario: string, password: string) => {
    const response = await api.post(API_URL, { nombre_usuario, password });
    console.log("Login response:", response.data);
    return response.data;
};