import React from "react";

type HeaderProps = {
  setIsOpen: (open: boolean) => void;
  user: any;
  setUser: (user: any | null) => void;
};

export const Header = ({ setIsOpen, user, setUser }: HeaderProps) => {
  const handleLoginClick = () => {
    setIsOpen(true);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <div className="header">
      <button onClick={user ? handleLogoutClick : handleLoginClick}>
        {user ? "Logout" : "Login Or Registration"}
      </button>
    </div>
  );
};
