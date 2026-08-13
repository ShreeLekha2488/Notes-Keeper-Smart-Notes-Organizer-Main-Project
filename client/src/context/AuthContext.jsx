import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
} from "../services/authService";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;

  });


  const [loading, setLoading] = useState(false);



  useEffect(() => {

    const checkUser = async () => {

      const token = localStorage.getItem("token");


      if (!token) {

        setUser(null);

        return;

      }


      try {

        const response = await getProfile();


        if (response.success) {

          setUser(response.user);

          localStorage.setItem(
            "user",
            JSON.stringify(response.user)
          );

        }


      } catch (error) {


        console.log(
          "Profile check failed",
          error
        );


        // KEEP USER LOGIN
        // Do not remove token here


      }

    };


    checkUser();


  }, []);




  const register = async (data) => {

    return await registerUser(data);

  };




  const login = async (credentials) => {


    const response = await loginUser(credentials);


    if (response.success) {


      setUser(response.user);


      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );


    }


    return response;

  };





  const logout = async () => {


    await logoutUser();


    localStorage.removeItem("token");

    localStorage.removeItem("user");


    setUser(null);


    window.location.href="/login";


  };





  return (

    <AuthContext.Provider

      value={{

        user,

        loading,

        isAuthenticated: !!user,

        register,

        login,

        logout,

        setUser,

      }}

    >

      {children}

    </AuthContext.Provider>

  );


};



export const useAuth = () => useContext(AuthContext);