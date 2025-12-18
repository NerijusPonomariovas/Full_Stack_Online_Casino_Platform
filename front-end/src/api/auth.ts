

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

      localStorage.setItem('token', token);
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

interface WalletBalanceResponse {
  balance: number;
}

export const fetchWalletBalance = async (): Promise<WalletBalanceResponse | AuthError> => {
  try {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        type: 'auth_error',
        message: 'No authentication token found. Please log in again.',
      };
    }

    // Send the GET request to the backend wallet balance endpoint
    const response = await axios.get(`${API_URL}/wallet/balance`, {
      headers: {
        "Content-Type": "application/json", // Ensure the request is sent as JSON
        "Authorization": `Bearer ${token}`, // Send token for authorization
      }
    });
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    if (response.data !== undefined) {
      console.log('Wallet balance fetched successfully!');
      return {
        balance: response.data,
      };
    } else {
      throw new Error('Wallet balance fetch failed: Invalid response');
    }
  } catch (error: any) {
    console.error('Error during wallet balance fetch:');
    if (error.response) {
      console.error('Error response:', error.response.data);
      return {
        type: 'http_error',
        message: `Wallet balance fetch failed: ${error.response.data.error || error.response.statusText}`,
      };
    } else if (error.request) {
      console.error('Error request:', error.request);
      return {
        type: 'network_error',
        message: 'Wallet balance fetch failed: No response received from the server',
      };
    } else {
      console.error('Error:', error.message);
      return {
        type: 'unknown_error',
        message: error.message || 'Wallet balance fetch failed: An unknown error occurred',
      };
    }
  }
}

export const updateWalletBalance = async (wager: string, outcome: "win" | "lose"): Promise<WalletBalanceResponse | AuthError> => {
  try {
    console.log("nigga");
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        type: 'auth_error',
        message: 'No authentication token found. Please log in again.',
      };
    }
    console.log(`Updating wallet balance with wager: ${wager}, outcome: ${outcome}`);

    // Prepare the request payload
    const payload = {
      wager: wager,
      outcome: outcome
    };

    // Send the POST request to update the wallet balance
    const response = await axios.post(`${API_URL}/wallet/wager`, payload, {
      headers: {
        "Content-Type": "application/json", // Ensure the request is sent as JSON
        "Authorization": `Bearer ${token}`, // Send token for authorization
      }
    });

    // Handle response
    if (response.status === 200 && response.data) {
      console.log('Wallet balance updated successfully!');
      return {
        balance: response.data.balance, // Update with the actual balance returned by the API
      };
    } else {
      throw new Error('Failed to update wallet balance');
    }
  } catch (error: any) {
    // Handle error response
    console.error('Error during wallet balance update:');
    if (error.response) {
      console.error('Error response:', error.response.data);
      return {
        type: 'http_error',
        message: `Wallet balance update failed: ${error.response.data.error || error.response.statusText}`,
      };
    } else if (error.request) {
      console.error('Error request:', error.request);
      return {
        type: 'network_error',
        message: 'Wallet balance update failed: No response received from the server',
      };
    } else {
      console.error('Error:', error.message);
      return {
        type: 'unknown_error',
        message: error.message || 'Wallet balance update failed: An unknown error occurred',
      };
    }
  }
};