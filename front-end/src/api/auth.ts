import axios from "axios";
/*
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
*/

const API_URL = 'http://your-backend-api-url'; // Update this with your actual backend URL

// Login API function
export const login = async (email: string, password: string) => {
  try {
    // Make the POST request to the backend login endpoint
    const response = await axios.post(`${API_URL}/user/login`, {
      username: email, // Send email as the username
      password: password
    });

    // Return the response data (you can modify this according to your backend response)
    if (response.data && response.data.token) {
      return {
        token: response.data.token,
        userName: response.data.userName
      };
    } else {
      throw new Error('Login failed: Invalid response');
    }
  } catch (error: unknown) {
    if(error instanceof Error)
    {
        throw new Error(error.message || 'An unknown error occurred');
    }
    else
    {
        throw new Error('An unknown error occurred');
    }
        
    // Handle errors (e.g., network errors, backend errors)
  }
};

export const register = async (
  email: string,
  username: string,
  password: string,
  confirmPassword:string
): Promise<void> => {
  try {
    if(password !== confirmPassword)
    {
        throw new Error("Password do not match");
    }
    const response = await axios.post(`${API_URL}/user/register`, {
      email,
      username,
      password
    });

    // Assuming no response body needed for success, otherwise handle it here
    if (response.status === 201) {
      console.log("User registered successfully");
    } else {
      throw new Error("Registration failed");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Registration failed');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};