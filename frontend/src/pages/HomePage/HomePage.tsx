import { Button } from "@mui/material"
import { logout } from "../../utils/logout"
import { useNavigate } from "react-router-dom"

const HomePage = () => {

  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <>
      <h1>Home Page</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  )
}

export default HomePage