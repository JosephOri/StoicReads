import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError,HttpStatusCode } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { AUTH_REGISTER_URL } from '../../utils/constants';
import SignupFormData from '../../interfaces/SignupFormData';
import isEmailValidCheck from '../../utils/isEmailValidCheck';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import 'react-toastify/dist/ReactToastify.css';


const SignupPage = () => {
  const [signupFormData, setSignupFormData] = useState<SignupFormData>({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const defaultTheme = createTheme();
  const navigate = useNavigate();

  const handleInputChange = (fieldName:string, value:string) => {
    setSignupFormData({ ...signupFormData, [fieldName]: value });
  };

  const isFormDataValidCheck = () => {
    const { userName, email, password, confirmPassword } = signupFormData;
    const isAllFieldsFilled = userName && email && password && confirmPassword;
    const isEmailValid = isEmailValidCheck(email);
    const isUsernameValid = !userName.includes(' ') && userName.length > 3;
    if(!isUsernameValid) {
      toast.error('Username must be at least 4 characters long and cannot contain spaces');
      return false;
    }
    if(!isAllFieldsFilled) {
      toast.error('Please fill in all fields');
      return false;
    }
    if(password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if(password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    if(!isEmailValid) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  }
  
  const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormDataValid = isFormDataValidCheck();
    if(!isFormDataValid) return;
    const {userName, email, password } = signupFormData;
    try {
      const response = await axios.post(AUTH_REGISTER_URL, { userName, email, password });
      console.log(response);
      toast.success('User created successfully');
      setSignupFormData({ userName: '', email: '', password: '', confirmPassword: '' });
      navigate('/login');
    } catch (err:unknown) {
      const error = err as AxiosError;
      if(error.response?.status === HttpStatusCode.BadRequest) {
        toast.error('Please fill in all fields');
      } else if(error.response?.status === HttpStatusCode.Conflict) {
        toast.error('User already exists');
      } else {
        toast.error('Server error occurred, please try again later');
      }
    }
  }
  
  return (
    <>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  name="userName"
                  value={signupFormData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
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
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                  onChange={(e) => handleInputChange('password', e.target.value)}
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
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
    </ThemeProvider>
    <ToastContainer />
    </>
  );
};

export default SignupPage;