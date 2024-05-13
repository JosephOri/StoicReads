import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios, { AxiosError,HttpStatusCode } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { AUTH_REGISTER_URL } from '../../utils/constants';
import SignupFormData from '../../interfaces/SignupFormData';
import isEmailValidCheck from '../../utils/isEmailValidCheck';

import 'react-toastify/dist/ReactToastify.css';
import './SignupPage.css'

const SignupPage = () => {
  const [signupFormData, setSignupFormData] = useState<SignupFormData>({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
    <div className="container">
      <div className="form-container">
        <h2 className="title">Sign Up</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 form-group" controlId="formBasicUsername">
            <Form.Label className="form-label">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter userName"
              className="form-control"
              value={signupFormData.userName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('userName', e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="formBasicEmail">
            <Form.Label className="form-label">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              className="form-control"
              value={signupFormData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="formBasicPassword">
            <Form.Label className="form-label">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              className="form-control"
              value={signupFormData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="formBasicConfirmPassword">
            <Form.Label className="form-label">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              className="form-control"
              value={signupFormData.confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{handleInputChange('confirmPassword', e.target.value)}}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="btn-primary">
            Sign Up
          </Button>
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Form>
      </div>
    </div>
    <ToastContainer />
  </>
  );
};

export default SignupPage;