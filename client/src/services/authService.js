import api from "./api";


/* ==========================================
   REGISTER
   POST /api/auth/register
========================================== */

export const registerUser = async (userData) => {

  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;

};


/* ==========================================
   LOGIN
   POST /api/auth/login
========================================== */

export const loginUser = async (credentials) => {

  const response = await api.post(
    "/auth/login",
    credentials
  );


  if (
    response.data.success &&
    response.data.token
  ) {

    localStorage.setItem(
      "token",
      response.data.token
    );


    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

  }


  return response.data;

};


/* ==========================================
   GET PROFILE
   GET /api/auth/profile
========================================== */

export const getProfile = async () => {

  const response = await api.get(
    "/auth/profile"
  );


  return response.data;

};


/* ==========================================
   UPDATE PROFILE
   PUT /api/auth/profile
========================================== */

export const updateProfile = async (formData) => {

  const response = await api.put(
    "/auth/profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.data.success) {

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

  }

  return response.data;
};


/* ==========================================
   CHANGE PASSWORD
   PUT /api/auth/change-password
========================================== */

export const changePassword = async (passwordData) => {

  const response = await api.put(
    "/auth/change-password",
    passwordData
  );


  return response.data;

};


/* ==========================================
   LOGOUT
========================================== */

export const logoutUser = async () => {

  localStorage.removeItem("token");

  localStorage.removeItem("user");

};

/* ==========================================
   GET SETTINGS
   GET /api/auth/settings
========================================== */

export const getSettings = async () => {
  const response = await api.get("/auth/settings");

  return response.data;
};


/* ==========================================
   UPDATE SETTINGS
   PUT /api/auth/settings
========================================== */

export const updateSettings = async (settings) => {
  const response = await api.put("/auth/settings", settings);

  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete("/auth/account");

  return response.data;
};