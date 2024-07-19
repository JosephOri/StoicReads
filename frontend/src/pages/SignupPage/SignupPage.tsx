import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AUTH_REGISTER_URL } from "../../utils/constants";
import SignupFormData from "../../interfaces/SignupFormData";
import isFormDataValidCheck from "../../utils/isFormDataValidCheck";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import defaultImage from '../../assets/image.jpg';


import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => {
  const [signupFormData, setSignupFormData] = useState<SignupFormData>({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: defaultImage,
  });
  const navigate = useNavigate();

  const handleInputChange = (fieldName: string, value: string) => {
    setSignupFormData({ ...signupFormData, [fieldName]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormDataValid = isFormDataValidCheck(signupFormData);
    if (!isFormDataValid) return;
    const { userName, email, password, profileImage } = signupFormData;
    try {
      const response = await axios.post(AUTH_REGISTER_URL, {
        userName,
        email,
        password,
        profileImage,
      });
      console.log(response);
      toast.success("User created successfully");
      setSignupFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: "",
      });
      navigate("/login");
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response?.status === HttpStatusCode.BadRequest) {
        toast.error("Please fill in all fields");
      } else if (error.response?.status === HttpStatusCode.Conflict) {
        toast.error("User already exists");
      } else {
        toast.error("Server error occurred, please try again later");
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignupFormData({ ...signupFormData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
    toast.success("Image uploaded successfully");
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          <Button component="label" variant="contained" color="success" sx={{ mt: 2, mb: 2 }}>
            Upload Image
            <input 
            type="file" 
            accept="image/*" 
            hidden 
            onChange={handleImageUpload} 
            />
          </Button>
          {signupFormData.profileImage && (
            <img src={signupFormData.profileImage} 
            alt="Profile Preview" 
            style={{ maxHeight: '150px', maxWidth: '150px' }}
             />
          )}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  name="userName"
                  value={signupFormData.userName}
                  onChange={(e) =>
                    handleInputChange("userName", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={signupFormData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={signupFormData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="confirm password"
                  type="password"
                  id="confirmPassword"
                  value={signupFormData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <ToastContainer />
    </>
  );
};

export default SignupPage;
