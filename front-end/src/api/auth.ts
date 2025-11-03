import axios from "axios";

const API_URL = 'http://localhost:5054/api/Account';

interface AuthResponse {
    token: string;
    userName: string,

}

export const login = async (email: string, password: string): Promise<AuthResponse> => {

    try
    {
        const response = await axios.post<AuthResponse>(`${API_URL}/login`, {email, password});
        return response.data;
    }
    catch (error: any){
        throw error.response?.data || "Login failed";
    }
    
};

export const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    roles: string
    ): Promise<void> =>
    {
        try
        {
            const response = await axios.post(`${API_URL}/register`, {
                name,
                email, 
                password,
                confirmPassword,
                roles
            });
            return response.data;
        }
        catch(error: any){
            throw error.response?.data || "Register failed";
        }
    };
    export const logout = (): void => {
        localStorage.removeItem("token");
        localStorage.removeItem("user")
    }