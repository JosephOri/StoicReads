import { Button } from "@mui/material"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_KEY, AUTH_LOGOUT_URL, REFRESH_TOKEN_KEY } from "../../utils/constants";
import { allowCorsForAxios } from "../../utils/allowCorsForAxios";
const HomePage = () => {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    navigate("/login");
    allowCorsForAxios(axios)
    await axios.post(AUTH_LOGOUT_URL, { refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) });
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  return (
    <>
      <h1>Home Page</h1>
      <Button onClick={handleLogOut}>Log Out</Button>
    </>
  )
}

export default HomePage