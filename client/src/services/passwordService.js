import API from "./api";

/**
 * Change Password
 */
export const changePassword = async (passwordData) => {
  const response = await API.put(
    "/profile/change-password",
    passwordData
  );

  return response.data;
};