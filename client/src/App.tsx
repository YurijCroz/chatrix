import React, { useEffect, useState } from "react";
import "./App.css";
import GeneralChat from "./components/GeneralChat";
import { LoginRegistration } from "./components/LoginRegistration";
import { Header } from "./components/Header";
import api from "./api/axiosConfig";

function App() {
  const [modalLoginIsOpen, setModalLoginIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const getUser = async () => {
      const { data } = await api.get("/chat/user");
      setUser(data);
    };

    if (token) {
      getUser();
    }
  }, []);

  return (
    <div className="App">
      <Header setIsOpen={setModalLoginIsOpen} user={user} setUser={setUser} />
      {modalLoginIsOpen && (
        <LoginRegistration setIsOpen={setModalLoginIsOpen} />
      )}
      <GeneralChat user={user} />
    </div>
  );
}

export default App;
