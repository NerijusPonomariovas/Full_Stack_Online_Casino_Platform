
//import axios from "axios";

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
    ): Promise<void> =>
    {
        try
        {
            const response = await axios.post(`${API_URL}/register`, {
                name,
                email, 
                password,
                confirmPassword
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



// Define your API URL here
const API_URL = 'https://monoauth.com/api'; // Update this with your actual backend URL

// Login API function
/*
export const login = async (email: string, password: string) => {
  try {
    // Make the POST request to the backend login endpoint
    const response = await axios.post(`${API_URL}/user/login`, {
      username: email, // Send email as the username
      password: password
    },
  {
    headers:
    {
      "Content-Type": "application/json",
    }
  });

    // Check the response data for token
    if (response.data && response.data.token) {
      // Save the token and user details in localStorage (or use a state management library like Redux)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.userName));

      return {
        token: response.data.token,
        userName: response.data.userName
      };
    } else {
      throw new Error('Login failed: Invalid response');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Provide a more descriptive error message
      throw new Error(error.message || 'An unknown error occurred during login');
    } else {
      throw new Error('An unknown error occurred during login');
    }
  }
};



// Register API function
export const register = async (
  email: string,
  username: string,
  password: string,
  confirmPassword: string
): Promise<void> => {
  try {
    // Check if passwords match before making the API request
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Send the register request to the backend
    const response = await axios.post(`${API_URL}/user/register`, {
      email,
      username,
      password
    });

    // Handle response after successful registration
    if (response.status === 201) {
      console.log("User registered successfully");
    } else {
      throw new Error("Registration failed");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Registration failed');
    } else {
      throw new Error('An unknown error occurred during registration');
    }
  }
};

// Logout function
export const logout = (): void => {
  // Remove token and user from localStorage when logging out
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('Logged out successfully');
};

// You can add a function to check if the user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return token ? true : false;
};

// You can also add a function to get the current user's information
export const getCurrentUser = (): string | null => {
  return localStorage.getItem('user');
};
*/

import axios from 'axios';

// Define the API URL
const API_URL = 'https://monoauth.com/api'; // Update with your actual backend URL

// Interface for login response
interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  message: string; // You can customize this as needed
}

// Interface for error handling
interface AuthError {
  type: string;
  message: string;
}

// Login function with debugging
export const login = async (username: string, password: string): Promise<LoginResponse | AuthError> => {
  try {
    // Debugging: Log the request details
    console.log('Attempting to log in with the following details:');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    // Create the request payload (JSON)
    const payload = {
      username: username,
      password: password
    };

    // Debugging: Log the payload before sending the request
    console.log('Request payload:', JSON.stringify(payload, null, 2));

    // Send the POST request to the backend login endpoint
    const response = await axios.post(`${API_URL}/user/login`, payload, {
      headers: {
        "Content-Type": "application/json", // Ensure the request is sent as JSON
      }
    });

    // Debugging: Log the response status and data
    console.log('Response status:', response.status);

    const token = response.data;
    // Check the response data for the token
    if (response.data) {
      // Debugging: Log token and user details
      console.log('Login successful!');
      console.log('Received token:', token);

      localStorage.setItem('token',token);
      return {
        token
      };
    } else {
      throw new Error('Login failed: Invalid response');
    }
  } catch (error: any) {
    // Debugging: Log error details
    console.error('Error during login:');
    if (error.response) {
      console.error('Error response:', error.response.data);
      return {
        type: 'http_error',
        message: `Login failed: ${error.response.data.error || error.response.statusText}`,
      };
    } else if (error.request) {
      console.error('Error request:', error.request);
      return {
        type: 'network_error',
        message: 'Login failed: No response received from the server',
      };
    } else {
      console.error('Error:', error.message);
      return {
        type: 'unknown_error',
        message: error.message || 'Login failed: An unknown error occurred',
      };
    }
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<RegisterResponse | AuthError> => {
  try {
    // Debugging: Log the request details
    console.log('Attempting to register with the following details:');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Confirm Password: ${confirmPassword}`);

    // Create the request payload (JSON)
    const payload = {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    // Debugging: Log the payload before sending the request
    console.log('Request payload:', JSON.stringify(payload, null, 2));

    // Send the POST request to the backend register endpoint
    const response = await axios.post(`${API_URL}/user/register`, payload, {
      headers: {
        "Content-Type": "application/json", // Ensure the request is sent as JSON
      }
    });

    // Debugging: Log the response status and data
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    // Handle successful registration response
    if (response.status === 201) {
      console.log('Registration successful!');
      return {
        message: 'User registered successfully',
      };
    } else {
      throw new Error('Registration failed: Invalid response');
    }
  } catch (error: any) {
    // Debugging: Log error details
    console.error('Error during registration:');
    if (error.response) {
      console.error('Error response:', error.response.data);
      return {
        type: 'http_error',
        message: `Registration failed: ${error.response.data.error || error.response.statusText}`,
      };
    } else if (error.request) {
      console.error('Error request:', error.request);
      return {
        type: 'network_error',
        message: 'Registration failed: No response received from the server',
      };
    } else {
      console.error('Error:', error.message);
      return {
        type: 'unknown_error',
        message: error.message || 'Registration failed: An unknown error occurred',
      };
    }
  }
};