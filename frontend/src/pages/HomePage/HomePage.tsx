import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { logoutAndNavigateToLogin } from "../../utils/logoutAndNavigateToLogin";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    logoutAndNavigateToLogin(navigate);
  };

  return (
    <>
      <h1>Home Page</h1>
      <Button onClick={handleLogOut}>Log Out</Button>
    </>
  )
}

export default HomePage