import axios from "axios";

const API = axios.create({
  baseURL: "https://notes-keeper-smart-notes-organizer.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});


// Attach Token
API.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);



// DO NOT LOGOUT AUTOMATICALLY
API.interceptors.response.use(

  (response) => response,

  (error) => {

    console.log(
      "API ERROR:",
      error.response?.status,
      error.response?.data,
      error.config?.url
    );

    return Promise.reject(error);
  }

);


export default API;