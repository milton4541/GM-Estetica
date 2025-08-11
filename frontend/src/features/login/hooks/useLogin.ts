import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../../utils/showNotification";
import { login } from "../api/login";
import { useAuth } from "../../usuarios/AuthContext";

export const useLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { applyLoginResponse } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false); // Reinicia el error
    setIsLoading(true); // Muestra el estado de carga

    try {  
      const data = await login(username, password);
      applyLoginResponse(data); 
      const { access_token } = data; // Extraer el token de la respuesta
  
      // Guardar el token en localStorage
      localStorage.setItem("authToken", access_token);
      showNotification("success", "Inicio de sesión exitoso");
      setIsLoading(false); // Detén el estado de carga
      navigate("/"); // Redirigir a la página de inicio

    } catch (err: unknown) {
        setError(true);

        if (axios.isAxiosError(err) && err.response?.data?.message) {
            showNotification("error", err.response.data.message);
        } else {
            showNotification("error", "Credenciales Incorrectas");
        }
        setIsLoading(false);
        }
    };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
};