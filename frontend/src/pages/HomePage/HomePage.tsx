import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/logout";

import LoginPage from "../LoginPage/LoginPage"


const HomePage = () => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <h1>Home Page</h1>
    </>
  )
}

export default HomePage