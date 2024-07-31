import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AUTH_REGISTER_URL, DEFAULT_IMAGE } from "../../utils/constants";
import SignupFormData from "../../interfaces/SignupFormData";
import isFormDataValidCheck from "../../utils/isFormDataValidCheck";
import {
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";


import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => {
  const [signupFormData, setSignupFormData] = useState<SignupFormData>({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: `${DEFAULT_IMAGE}`,
    profileImageFile: null,
  });
  const [displayedImage, setDisplayedImage] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (fieldName: string, value: string) => {
    setSignupFormData({ ...signupFormData, [fieldName]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSignupFormData({ ...signupFormData, profileImageFile: e.target.files[0] });
    }
    setDisplayedImage(URL.createObjectURL(e.target.files![0]));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormDataValid = isFormDataValidCheck(signupFormData);
    if (!isFormDataValid) return;
    const formData = new FormData();
    formData.append("userName", signupFormData.userName);
    formData.append("email", signupFormData.email);
    formData.append("password", signupFormData.password);
    formData.append("profileImage", signupFormData.profileImage);
    if(signupFormData.profileImageFile) {
      formData.append("profileImage", signupFormData.profileImageFile);
    }
    try {
      const response = await axios.post(AUTH_REGISTER_URL, formData);
      console.log(response);
      toast.success("User created successfully");
      setSignupFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: `${DEFAULT_IMAGE}`,
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
          {displayedImage && (
            <img src={`${displayedImage}`} 
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
