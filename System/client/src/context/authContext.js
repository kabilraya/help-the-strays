import { useState, useContext, useEffect, createContext } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Invalid JSON in localStorage:", error);
      return null;
    }
  });
  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:8000/api/auth/login",
      inputs,
      {
        withCredentials: true,
      }
    );
    setCurrentUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
  };
  // useEffect(() => {
  //   // localStorage.removeItem("user");
  //   localStorage.setItem("user", JSON.stringify(currentUser));
  // }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
